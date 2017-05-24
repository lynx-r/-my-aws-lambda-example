import {UserService} from "../service/user.service";
import {Response} from "../model/response";
import {inject} from "inversify";
import {Controller, Get, interfaces, Post, TYPE} from "inversify-restify-utils";
import {TYPES} from "../constant/types";
import {nconf} from "../config/config";
import jwt = require("jsonwebtoken");
import * as passport from "passport";
import * as restify from 'restify';
import TAGS from "../constant/tags";
import {provideNamed} from "../ioc/ioc";

@Controller('/users')
@provideNamed(TYPE.Controller, TAGS.UserController)
export class UserController implements interfaces.Controller {

  private passport = new passport.Passport();

  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @Post('/')
  createUser(req: restify.Request, res: restify.Response, next: restify.Next) {
    console.log(req.body);
    res.json(new Response(true, req.body));
    // this.userService.createUser(req.body, (err, user) => {
    //   if (err) {
    //     console.log(err);
    //     return res.json(new InternalServerError())
    //   }
    //   res.json(new Response(true, 'User was created', user));
    //   next();
    // });
  }

  @Post('/login')
  login(req, res,next) {
    this.passport.authenticate('local', function (err, user) {
      if (user == false) {
        res.json(new Response(false, "Login failed"));
      } else {
        //--payload - информация которую мы храним в токене и можем из него получать
        const payload = {
          id: user._id,
          displayName: user.displayName,
          email: user.email
        };
        const token = jwt.sign(payload, nconf.get('jwtSecret'), { expiresIn: 7200 }); //здесь создается JWT

        res.json(new Response(true, 'User logged in', {userId: user._id, token: token}));
      }
    })(req, res, next);
  }

  @Get('/')
  findUsers(req, res, next) {
  }

  @Get('/:id')
  findUser(req, res, next) {
  }

}