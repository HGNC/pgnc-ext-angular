import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GeneSymbolReport } from "./gene-symbol-report.model";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../../common/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class GeneReportService {

    private httpClient = inject(HttpClient);
    private authService = inject(AuthService);
    error = signal<string | undefined>(undefined);

    // constructor() { }

    public getReportById(pgncId: string): Observable<GeneSymbolReport> {
        if (pgncId.startsWith('PGNC:')) {
            pgncId = pgncId.substring(5);
        }
        return this.httpClient.get<GeneSymbolReport>(
            `/api/gene/${pgncId}`,
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.authService.getJwt()
                })
            }
        ).pipe(catchError(
            (error) => {
                console.error(error);
                return throwError(
                    () =>
                        new Error('Problem found when fetching data. Please try again later')
                )
            }
        ));
    }
}
