import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, In, MoreThan, Repository } from "typeorm";
import Fork from "./fork.entity";
import ForkNotFoundException from "../exceptions/ForkNotFoundException";
import User from "../user/user.entity";
import CreateForkDto from "./fork.dto";
import { Events } from "../utils/types/events.enum";
import EventEmitter from "../utils/eventEmitter";
@Service()
class ForkService {
  constructor(
    @InjectRepository(Fork) private readonly forkRepository: Repository<Fork>
  ) {}
  async getForks(
    offset?: number,
    limit?: number,
    startId?: number,
    options?: FindManyOptions<Fork>
  ) {
    const where: FindManyOptions<Fork>["where"] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.forkRepository.count();
    }
    const [items, count] = await this.forkRepository.findAndCount({
      order: {
        id: "ASC",
      },
      skip: offset,
      take: limit,
      ...options,
    });
    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async getForkById(id: number) {
    const fork = await this.forkRepository.findOne(id, {
      relations: ["author"],
    });
    if (fork) {
      return fork;
    }
    throw new ForkNotFoundException(id);
  }

  async createFork(fork: CreateForkDto, user: User) {
    const newFork = await this.forkRepository.create({
      ...fork,
      owner: user,
    });
    await this.forkRepository.save(newFork);
    EventEmitter.emit(Events.ForkCreated, newFork);
    return newFork;
  }
}

export default ForkService;
