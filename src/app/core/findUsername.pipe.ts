import { Pipe, PipeTransform } from "@angular/core";
import { User } from "../models/user.model";

@Pipe({ name: 'findUsername' })
export class FindUserNamePipe implements PipeTransform {
    transform(userId: number, users: User[]): string {
        const user = users.find(x => x.id === userId);
        return user ? user.name : 'Unknown';
    }
}