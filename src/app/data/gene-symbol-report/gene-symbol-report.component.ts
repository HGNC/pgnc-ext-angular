import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../../header/header.component';
import { GeneReportService } from './gene-symbol-report.service';
import { GeneSymbolReport } from './gene-symbol-report.model';
import { GeneSymbol } from './gene-symbol.model';
import { GeneName } from './gene-name.model';
import { GeneLocation } from './gene-location.model';
import { Xref } from './xref-resources/xref-resources.model';
import { XrefComponent } from './xref-resources/xref-resources.component';


@Component({
  selector: 'app-gene-symbol-report',
  imports: [HeaderComponent, XrefComponent, FontAwesomeModule],
  templateUrl: './gene-symbol-report.component.html',
  styleUrl: './gene-symbol-report.component.css'
})
export class GeneSymbolReportComponent implements OnInit {
    @Input({required: true}) type!: string;
    @Input({required: true}) id!: string;

    faQuestionCircle = faQuestionCircle;
    
    report = signal<GeneSymbolReport | undefined>(undefined);
    isFetching = signal(false);
    error = signal<string | undefined>(undefined);
    private geneSymbolReportService = inject(GeneReportService);
    private destroyRef = inject(DestroyRef);
    appSymbol: GeneSymbol | undefined;
    appName: GeneName | undefined;
    prevSymbols: GeneSymbol[] | undefined;
    prevNames: GeneName[] | undefined;
    aliasSymbols: GeneSymbol[] | undefined;
    aliasNames: GeneName[] | undefined;
    location: GeneLocation | undefined;
    xrefs: Xref[] | undefined;

    ngOnInit() {
        this.isFetching.set(true);
        const subscription = this.geneSymbolReportService
            .getReportById(this.id)
            .subscribe({
                next: (result) => {
                    this.report.set(result);
                    this.appSymbol = result.data?.geneSymbols?.find((geneSymbol) => { return geneSymbol.type === 'approved'; });
                    this.appName = result.data?.geneNames?.find((geneName) => { return geneName.type === 'approved'; });
                    this.prevSymbols = result.data?.geneSymbols?.filter((geneSymbol) => { return geneSymbol.type === 'previous'; });
                    this.prevNames = result.data?.geneNames?.filter((geneName) => { return geneName.type === 'previous'; });
                    this.aliasSymbols = result.data?.geneSymbols?.filter((geneSymbol) => { return geneSymbol.type === 'alias'; });
                    this.aliasNames = result.data?.geneNames?.filter((geneName) => { return geneName.type === 'alias'; });
                    this.location = result.data?.geneLocations?.find(
                        (geneLocation) => {
                            return geneLocation.location.type === 'primary assembly' && geneLocation.location.coordSystem === 'chromosome';
                        }
                    );
                    this.xrefs = result.data?.geneXrefs as Xref[];
                },  
                error: (err: Error) => {
                    this.error.set(err.message);
                },
                complete: () => {
                    this.isFetching.set(false);
                },
            });
        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
        });
    }
}
