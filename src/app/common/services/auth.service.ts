import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private jwt: string;
    private localStorageService: LocalStorageService = inject(LocalStorageService);

    constructor() {
        let jwt: string | null;
        if (jwt = this.localStorageService.getItem('JWT')) {
            this.jwt = jwt;
        } else {
            this.jwt = import.meta.env.NG_APP_JWT;
            this.localStorageService.setItem('JWT', this.jwt);
        }
    }

    getJwt(): string {
        return this.jwt;
    }

}
