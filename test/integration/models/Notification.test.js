var assert = require('chai').assert;
var sinon = require('sinon');
var taskFixtures = require('../../fixtures/task');
var userFixtures = require('../../fixtures/user');

describe('Notification model', function() {

  beforeEach(function(done){
      done();
  });

  describe('#create', function() {
    describe('with data', function() {
      var notification;
      var data, action;

      beforeEach(function(done) {
        data = {name: 'one'};
        action = 'thing.start';
        Notification.create({
          action: action,
          model: data
        })
        .then(function(newNotification) {
          notification = newNotification;
          done()
        })
        .catch(done);
      });

      it('should save attributes', function (done) {
        assert.equal(notification.action, action);
        assert.deepEqual(notification.model, data);
        done();
      });
    });

    it('should call trigger', function (done) {
      var oldTrigger = Notification.trigger;
      var called = false;
      var notification;
      Notification.trigger = function(model, cb) {
        assert.property(model, 'action')
        assert.equal(model.action, 'whatever')
        called = true;
      }
      Notification.create({action: 'whatever'})
      .then(function(notification) {
        assert.equal(called, true);
        Notification.trigger = oldTrigger;
        done();
      })
      .catch(done);
    });
  });


  describe('#trigger', function() {
    var user, task;
    var email;

    function checkTriggerEmail(data, done) {
      Notification.trigger(data, function(err, info) {
        assert.isNull(err);
        done(err, email);
      });
    }

    beforeEach(function(done) {
      Notification._transport.sendMail = function mockSend(options, cb) {
        email = options;
        cb(null);
      };

      User.create(userFixtures.minAttrs)
      .then(function(newUser) {
        user = newUser;
        done();
      }).catch(done);
    })
    before(function() {
      sails.config.emailProtocol = 'SMTP';
    })
    after(function() {
      sails.config.emailProtocol = '';
    })


    it('user.create.welcome', function (done) {
      data = {action: 'user.create.welcome', model:user};
      checkTriggerEmail(data, function(err, email) {
        assert.equal(email.to, user.username);
        assert.equal(email.subject, "Welcome to "+sails.config.systemName);
        done();
      })
    });
    describe('for draft task', function() {
      beforeEach(function(done) {
        Task.create(taskFixtures.draft)
        .then(function(newTask) {
          task = newTask;
          done();
        });
      });
      it('task.create.draft', function (done) {
        data = {action: 'task.create.draft', model:task};
        checkTriggerEmail(data, function(err, email) {
          assert.equal(email.to, user.username);
          assert.equal(email.subject, "New Open Opportunity Draft Created");
          done();
        })
      });
    });
    describe('for submitted task', function() {
      beforeEach(function(done) {
        Task.create(taskFixtures.oneTimeSubmitted)
        .then(function(newTask) {
          task = newTask;
          done();
        });
      });
      it('task.create.thanks', function (done) {
        data = {action: 'task.create.thanks', model:task}
        checkTriggerEmail(data, function(err, email) {
          assert.equal(email.to, user.username);
          assert.equal(email.subject, "New Opportunity Submission");
          done();
        })
      });
    });

  });

});
