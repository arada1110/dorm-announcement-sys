import { DormitoryRepository } from "@/data/sql/repositories/Dormitory.repostory";

export class DormitoryService {
    constructor(private readonly dormRepo: DormitoryRepository) {}

    async findDormitory(name: string) {
        return this.dormRepo.findDormitoryByName(name);
    }
}
