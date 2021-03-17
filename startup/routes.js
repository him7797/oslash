const express=require('express');
const user = require('../routes/users');
const posts = require('../routes/posts');
const employees = require('../routes/employees');
const admin=require('../routes/adminPost');
const superadmin=require('../routes/superadmin');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', user);
  app.use('/api/posts', posts);
  app.use('/api/employee', employees);
  app.use('/api/admin',admin);
  app.use('/api/superadmin',superadmin);
};
