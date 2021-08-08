import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import Category from "./category.entity";
import CreateCategoryDto from "./category.dto";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import Fork from "../fork/fork.entity";

@Service()
class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Fork)
    private readonly forkRepository: Repository<Fork>
  ) {}

  async createCategory(category: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async getAllCategories() {
    return await this.categoryRepository.find();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (category) {
      return category;
    } else {
      throw new CategoryNotFoundException(id);
    }
  }

  async getCategoryWithForksById(
    id: number,
    offset?: number,
    limit?: number,
    startId?: number
  ) {
    let separateCount = 0;
    //TODO: move to fork module for path .../forks?categories=1&categories=2
    const getAllForkByCategoryIdQuery = this.forkRepository
      .createQueryBuilder("fork")
      .leftJoin("fork.categories", "category")
      .where(`category.id = :id ${startId ? "and fork.id > :startId" : ""}`, {
        id,
        startId,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ "fork.id": "ASC" })
      .getManyAndCount();
    if (startId) {
      separateCount = await this.categoryRepository.count();
    }
    const [items, count] = await getAllForkByCategoryIdQuery;

    return {
      items,
      count: startId ? separateCount : count,
    };
  }
}

export default CategoryService;
