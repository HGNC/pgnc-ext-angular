import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Xref } from './xref-resources.model';
import { ExternalResourceName } from './external-resource-name.type';

@Component({
  selector: 'app-xref-resources',
  imports: [FontAwesomeModule],
  templateUrl: './xref-resources.component.html',
  styleUrl: './xref-resources.component.css'
})
export class XrefComponent {
    
    @Input({required: true}) geneXrefs: Xref[] | undefined;
    @Input({required: true}) symbol: string | undefined;
    
    faQuestionCircle=faQuestionCircle;
    
    xrefURLS: Record<ExternalResourceName, string> = {
        'NCBI Gene': 'https://www.ncbi.nlm.nih.gov/gene/',
        'Ensembl Gene': 'https://plants.ensembl.org/Populus_trichocarpa/Gene/Summary?db=core;g=',
        'UniProt': 'https://www.uniprot.org/uniprotkb/',
        'PubMed': 'https://pubmed.ncbi.nlm.nih.gov/',
        'Phytozome': 'https://phytozome-next.jgi.doe.gov/report/gene/Ptrichocarpa_v4_1/',
    };

    // Type guard to ensure name is ExternalResourceName
    isValidResourceName(name: string): name is ExternalResourceName {
        return name in this.xrefURLS;
    }

}
