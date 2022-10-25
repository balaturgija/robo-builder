import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GlobalRole } from '../../constants';
import { UserHaveNoRoleException } from '../exceptions/user-have-no-role.exception';

@Injectable()
export class RoleGuard implements CanActivate {
    /**
     *
     */
    constructor(private reflector: Reflector) {}

    matchRoles(roles: GlobalRole[], userRole: string): boolean {
        console.log('\x1b[32m Executing Role Guard \x1b[0m');

        return roles.some((role) => role === userRole);
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<GlobalRole[]>(
            'roles',
            context.getHandler()
        );
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();

        const user: User = request.user;

        if (!user.role) throw new UserHaveNoRoleException('User have no role.');

        const result = this.matchRoles(roles, user.role.name);

        return result;
    }
}
