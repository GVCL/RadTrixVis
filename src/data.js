export const data = {
    "nodes":
        [{ "index": 0, "name": "Kidney" },
        { "index": 1, "name": "Colon" },
        { "index": 2, "name": "Breast" },
        { "index": 3, "name": "GBM" },
        { "index": 4, "name": "Lung" }],

    "links":
        [{ "source": 0, "target": 0, "value": 29 },
        { "source": 0, "target": 1, "value": 15 },
        { "source": 0, "target": 2, "value": 12 },
        { "source": 0, "target": 3, "value": 20 },
        { "source": 0, "target": 4, "value": 18 },
        { "source": 1, "target": 1, "value": 36 },
        { "source": 1, "target": 2, "value": 15 },
        { "source": 1, "target": 3, "value": 29 },
        { "source": 1, "target": 4, "value": 24 },
        { "source": 2, "target": 2, "value": 35 },
        { "source": 2, "target": 3, "value": 28 },
        { "source": 2, "target": 4, "value": 24 },
        { "source": 3, "target": 3, "value": 58 },
        { "source": 3, "target": 4, "value": 41 },
        { "source": 4, "target": 4, "value": 51 }
        ],

    "circlenodes":
        [
            { "name": "ERG" },
            { "name": "ETV1" },
            { "name": "HOXA9" },
            { "name": "PDGFB" },
            { "name": "PDGFRA" },
            { "name": "WT1" },
            { "name": "ABL2" },
            { "name": "BCL3" },
            { "name": "BCR" },
            { "name": "CCND1" },
            { "name": "CCND2" },
            { "name": "CSF3R" },
            { "name": "FGFR2" },
            { "name": "FHIT" },
            { "name": "FLI1" },
            { "name": "FLT3" },
            { "name": "GAS7" },
            { "name": "MAF" },
            { "name": "MYCL1" },
            { "name": "PDGFRB" },
            { "name": "PIK3R1" },
            { "name": "PPARG" },
            { "name": "RARA" },
            { "name": "TFRC" },
            { "name": "ABL1" },
            { "name": "AKT1" },
            { "name": "ALK" },
            { "name": "APC" },
            { "name": "AXIN1" },
            { "name": "CDH11" },
            { "name": "CDK6" },
            { "name": "COL1A1" },
            { "name": "DDB2" },
            { "name": "DDIT3" },
            { "name": "EGFR" },
            { "name": "FANCA" },
            { "name": "FANCE" },
            { "name": "FGFR1" },
            { "name": "FGFR3" },
            { "name": "GNAS" },
            { "name": "KRAS" },
            { "name": "LMO1" },
            { "name": "LMO2" },
            { "name": "MALT1" },
            { "name": "MET" },
            { "name": "MUC1" },
            { "name": "MYB" },
            { "name": "NOTCH1" },
            { "name": "PRKAR1A" },
            { "name": "RAF1" },
            { "name": "SMARCA4" },
            { "name": "STK11" },
            { "name": "SYK" },
            { "name": "TERT" },
            { "name": "CASP8" },
            { "name": "CDH1" },
            { "name": "CREB1" },
            { "name": "CTNNB1" },
            { "name": "ERCC3" },
            { "name": "EXT1" },
            { "name": "GPC3" },
            { "name": "HLF" },
            { "name": "ITK" },
            { "name": "KIT" },
            { "name": "LCK" },
            { "name": "MLF1" },
            { "name": "MYH11" },
            { "name": "NFKB2" },
            { "name": "RET" },
            { "name": "SMARCB1" },
            { "name": "SMO" },
            { "name": "TAL1" },
            { "name": "MSH2" }
        ],

    "circleedges":
        [{ "source": "ABL1", "target": "Breast" },
        { "source": "AKT1", "target": "Breast" },
        { "source": "APC", "target": "Breast" },
        { "source": "AXIN1", "target": "Breast" },
        { "source": "CASP8", "target": "Breast" },
        { "source": "CDH11", "target": "Breast" },
        { "source": "CDK6", "target": "Breast" },
        { "source": "CREB1", "target": "Breast" },
        { "source": "CTNNB1", "target": "Breast" },
        { "source": "DDB2", "target": "Breast" },
        { "source": "EGFR", "target": "Breast" },
        { "source": "EXT1", "target": "Breast" },
        { "source": "FANCA", "target": "Breast" },
        { "source": "FANCE", "target": "Breast" },
        { "source": "FGFR2", "target": "Breast" },
        { "source": "FLI1", "target": "Breast" },
        { "source": "HLF", "target": "Breast" },
        { "source": "ITK", "target": "Breast" },
        { "source": "LCK", "target": "Breast" },
        { "source": "MAF", "target": "Breast" },
        { "source": "MET", "target": "Breast" },
        { "source": "MLF1", "target": "Breast" },
        { "source": "MSH2", "target": "Breast" },
        { "source": "MUC1", "target": "Breast" },
        { "source": "MYB", "target": "Breast" },
        { "source": "MYH11", "target": "Breast" },
        { "source": "NOTCH1", "target": "Breast" },
        { "source": "PDGFRB", "target": "Breast" },
        { "source": "PRKAR1A", "target": "Breast" },
        { "source": "RARA", "target": "Breast" },
        { "source": "RET", "target": "Breast" },
        { "source": "SMARCB1", "target": "Breast" },
        { "source": "SYK", "target": "Breast" },
        { "source": "TAL1", "target": "Breast" },
        { "source": "TERT", "target": "Breast" },
        { "source": "ALK", "target": "Colon" },
        { "source": "AXIN1", "target": "Colon" },
        { "source": "BCR", "target": "Colon" },
        { "source": "CASP8", "target": "Colon" },
        { "source": "CDH1", "target": "Colon" },
        { "source": "COL1A1", "target": "Colon" },
        { "source": "CREB1", "target": "Colon" },
        { "source": "CSF3R", "target": "Colon" },
        { "source": "CTNNB1", "target": "Colon" },
        { "source": "DDIT3", "target": "Colon" },
        { "source": "ERCC3", "target": "Colon" },
        { "source": "EXT1", "target": "Colon" },
        { "source": "FGFR2", "target": "Colon" },
        { "source": "FGFR3", "target": "Colon" },
        { "source": "FHIT", "target": "Colon" },
        { "source": "GNAS", "target": "Colon" },
        { "source": "GPC3", "target": "Colon" },
        { "source": "HLF", "target": "Colon" },
        { "source": "ITK", "target": "Colon" },
        { "source": "KIT", "target": "Colon" },
        { "source": "KRAS", "target": "Colon" },
        { "source": "LCK", "target": "Colon" },
        { "source": "MALT1", "target": "Colon" },
        { "source": "MLF1", "target": "Colon" },
        { "source": "MSH2", "target": "Colon" },
        { "source": "MYCL1", "target": "Colon" },
        { "source": "MYH11", "target": "Colon" },
        { "source": "NFKB2", "target": "Colon" },
        { "source": "PDGFRB", "target": "Colon" },
        { "source": "PPARG", "target": "Colon" },
        { "source": "SMARCA4", "target": "Colon" },
        { "source": "SMARCB1", "target": "Colon" },
        { "source": "SMO", "target": "Colon" },
        { "source": "STK11", "target": "Colon" },
        { "source": "TAL1", "target": "Colon" },
        { "source": "TFRC", "target": "Colon" },
        { "source": "ABL1", "target": "GBM" },
        { "source": "AKT1", "target": "GBM" },
        { "source": "ALK", "target": "GBM" },
        { "source": "APC", "target": "GBM" },
        { "source": "BCL3", "target": "GBM" },
        { "source": "BCR", "target": "GBM" },
        { "source": "CASP8", "target": "GBM" },
        { "source": "CCND1", "target": "GBM" },
        { "source": "CCND2", "target": "GBM" },
        { "source": "CDH1", "target": "GBM" },
        { "source": "COL1A1", "target": "GBM" },
        { "source": "CREB1", "target": "GBM" },
        { "source": "CSF3R", "target": "GBM" },
        { "source": "CTNNB1", "target": "GBM" },
        { "source": "DDB2", "target": "GBM" },
        { "source": "DDIT3", "target": "GBM" },
        { "source": "EGFR", "target": "GBM" },
        { "source": "ERCC3", "target": "GBM" },
        { "source": "ERG", "target": "GBM" },
        { "source": "ETV1", "target": "GBM" },
        { "source": "EXT1", "target": "GBM" },
        { "source": "FANCE", "target": "GBM" },
        { "source": "FGFR1", "target": "GBM" },
        { "source": "FGFR3", "target": "GBM" },
        { "source": "FLT3", "target": "GBM" },
        { "source": "GAS7", "target": "GBM" },
        { "source": "GNAS", "target": "GBM" },
        { "source": "GPC3", "target": "GBM" },
        { "source": "HLF", "target": "GBM" },
        { "source": "HOXA9", "target": "GBM" },
        { "source": "ITK", "target": "GBM" },
        { "source": "KIT", "target": "GBM" },
        { "source": "KRAS", "target": "GBM" },
        { "source": "LCK", "target": "GBM" },
        { "source": "LMO1", "target": "GBM" },
        { "source": "LMO2", "target": "GBM" },
        { "source": "MAF", "target": "GBM" },
        { "source": "MET", "target": "GBM" },
        { "source": "MLF1", "target": "GBM" },
        { "source": "MSH2", "target": "GBM" },
        { "source": "MUC1", "target": "GBM" },
        { "source": "MYB", "target": "GBM" },
        { "source": "MYH11", "target": "GBM" },
        { "source": "NFKB2", "target": "GBM" },
        { "source": "NOTCH1", "target": "GBM" },
        { "source": "PDGFRA", "target": "GBM" },
        { "source": "PRKAR1A", "target": "GBM" },
        { "source": "RAF1", "target": "GBM" },
        { "source": "RARA", "target": "GBM" },
        { "source": "RET", "target": "GBM" },
        { "source": "SMARCA4", "target": "GBM" },
        { "source": "SMARCB1", "target": "GBM" },
        { "source": "SMO", "target": "GBM" },
        { "source": "STK11", "target": "GBM" },
        { "source": "SYK", "target": "GBM" },
        { "source": "TAL1", "target": "GBM" },
        { "source": "TERT", "target": "GBM" },
        { "source": "TFRC", "target": "GBM" },
        { "source": "ABL2", "target": "Kidney" },
        { "source": "CASP8", "target": "Kidney" },
        { "source": "CDH1", "target": "Kidney" },
        { "source": "CDH11", "target": "Kidney" },
        { "source": "CDK6", "target": "Kidney" },
        { "source": "ERCC3", "target": "Kidney" },
        { "source": "FANCA", "target": "Kidney" },
        { "source": "FGFR1", "target": "Kidney" },
        { "source": "FGFR3", "target": "Kidney" },
        { "source": "GPC3", "target": "Kidney" },
        { "source": "ITK", "target": "Kidney" },
        { "source": "KIT", "target": "Kidney" },
        { "source": "LMO1", "target": "Kidney" },
        { "source": "LMO2", "target": "Kidney" },
        { "source": "MALT1", "target": "Kidney" },
        { "source": "MLF1", "target": "Kidney" },
        { "source": "MSH2", "target": "Kidney" },
        { "source": "MUC1", "target": "Kidney" },
        { "source": "MYCL1", "target": "Kidney" },
        { "source": "NFKB2", "target": "Kidney" },
        { "source": "PIK3R1", "target": "Kidney" },
        { "source": "PPARG", "target": "Kidney" },
        { "source": "RAF1", "target": "Kidney" },
        { "source": "RET", "target": "Kidney" },
        { "source": "SMARCB1", "target": "Kidney" },
        { "source": "SMO", "target": "Kidney" },
        { "source": "SYK", "target": "Kidney" },
        { "source": "TERT", "target": "Kidney" },
        { "source": "WT1", "target": "Kidney" },
        { "source": "ABL1", "target": "Lung" },
        { "source": "ABL2", "target": "Lung" },
        { "source": "AKT1", "target": "Lung" },
        { "source": "ALK", "target": "Lung" },
        { "source": "APC", "target": "Lung" },
        { "source": "AXIN1", "target": "Lung" },
        { "source": "BCL3", "target": "Lung" },
        { "source": "CCND1", "target": "Lung" },
        { "source": "CCND2", "target": "Lung" },
        { "source": "CDH1", "target": "Lung" },
        { "source": "CDH11", "target": "Lung" },
        { "source": "CDK6", "target": "Lung" },
        { "source": "COL1A1", "target": "Lung" },
        { "source": "CREB1", "target": "Lung" },
        { "source": "CTNNB1", "target": "Lung" },
        { "source": "DDB2", "target": "Lung" },
        { "source": "DDIT3", "target": "Lung" },
        { "source": "EGFR", "target": "Lung" },
        { "source": "ERCC3", "target": "Lung" },
        { "source": "EXT1", "target": "Lung" },
        { "source": "FANCA", "target": "Lung" },
        { "source": "FANCE", "target": "Lung" },
        { "source": "FGFR1", "target": "Lung" },
        { "source": "FHIT", "target": "Lung" },
        { "source": "FLI1", "target": "Lung" },
        { "source": "FLT3", "target": "Lung" },
        { "source": "GAS7", "target": "Lung" },
        { "source": "GNAS", "target": "Lung" },
        { "source": "GPC3", "target": "Lung" },
        { "source": "HLF", "target": "Lung" },
        { "source": "KIT", "target": "Lung" },
        { "source": "KRAS", "target": "Lung" },
        { "source": "LCK", "target": "Lung" },
        { "source": "LMO1", "target": "Lung" },
        { "source": "LMO2", "target": "Lung" },
        { "source": "MALT1", "target": "Lung" },
        { "source": "MET", "target": "Lung" },
        { "source": "MSH2", "target": "Lung" },
        { "source": "MYB", "target": "Lung" },
        { "source": "MYH11", "target": "Lung" },
        { "source": "NFKB2", "target": "Lung" },
        { "source": "NOTCH1", "target": "Lung" },
        { "source": "PDGFB", "target": "Lung" },
        { "source": "PIK3R1", "target": "Lung" },
        { "source": "PRKAR1A", "target": "Lung" },
        { "source": "RAF1", "target": "Lung" },
        { "source": "RET", "target": "Lung" },
        { "source": "SMARCA4", "target": "Lung" },
        { "source": "SMO", "target": "Lung" },
        { "source": "STK11", "target": "Lung" },
        { "source": "TAL1", "target": "Lung" }
        ]
}    