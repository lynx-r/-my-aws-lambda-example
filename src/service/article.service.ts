import {IArticle} from "../model/article";
import {ArticleRepository} from "../dao/article-repository";
import {inject, injectable} from "inversify";
import {TYPES} from "../di/types.const";

@injectable()
export class ArticleService {

  constructor(@inject(TYPES.ArticleRepository) private repo: ArticleRepository) {
  }

  findAll(callback) {
    this.repo.find((err: any, res: IArticle[]) => {
      callback(err, res);
    });
  }

  findById(_id: string, callback) {
    if (!_id) {
      throw 'Invalid id';
    }

    this.repo.findById(_id, callback);
  }

}
