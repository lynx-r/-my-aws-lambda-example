'use strict';

/**
 * Module dependencies.
 */

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

interface IUser extends mongoose.Document {
  displayName: string,
  email: string,
  hashed_password?: string,
}

/**
 * User Schema
 */
let UserSchema = new Schema({
  displayName: {type: String, default: ''},
  email: {
    type: String,
    required: 'Укажите e-mail',
    unique: 'Такой e-mail уже существует'
  },
  hashed_password: {type: String, default: ''},
}, {
  timestamps: true
});

UserSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      this.passwordHash = bcrypt.hashSync(password, salt);
    } else {
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

UserSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return bcrypt.compareSync(password, this.passwordHash);
};

let UserModel = mongoose.model<IUser>('User', UserSchema, 'Users', true);

export {IUser, UserSchema, UserModel};