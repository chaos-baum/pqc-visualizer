export const pqcData = {
    hqc: {
        name: "HQC",
        levels: {
            'Level 1 (128-bit)': 'HQC-128',
            'Level 3 (192-bit)': 'HQC-192',
            'Level 5 (256-bit)': 'HQC-256'
        },
        levelParams: {
            'Level 1 (128-bit)': { n: 17669, w: 66, t: 75 },
            'Level 3 (192-bit)': { n: 35851, w: 100, t: 114 },
            'Level 5 (256-bit)': { n: 57637, w: 131, t: 149 }
        },
        comparison: {
            setup: { "Struktur": "Ring-basiert (NTRU-ähnlich)", "Grundlage": "Quasi-zyklische Codes" },
            keygen: {
                "Größe Public Key": "2.249 Bytes",
                "Größe Secret Key": "2.289 Bytes",
                "CPU-Zyklen (kcc)": "~300" 
            },
            encaps: {
                "Größe Ciphertext": "4.497 Bytes",
                "CPU-Zyklen (kcc)": "~450" 
            },
            decaps: {
                "Info": "Schnelle Entkapselung, extrem geringe DFR.",
                "CPU-Zyklen (kcc)": "~650" 
            },
            "Performanz-Quelle": "NIST PQC Round 3 Submission / AVX2 on Intel Skylake"
        },
        tabs: [
            { id: "setup", title: "Setup", contentFile: "setup.md"},
            { id: "keygen", title: "KeyGen", contentFile: "keygen.md" },
            { id: "encaps", title: "Encaps", contentFile: "encaps.md" },
            { id: "decaps", title: "Decaps", contentFile: "decaps.md" }
        ]
    },
    bike: {
        name: "BIKE",
        levels: {
            'Level 1 (128-bit)': 'BIKE-L1',
            'Level 3 (192-bit)': 'BIKE-L3',
            'Level 5 (256-bit)': 'BIKE-L5'
        },
        levelParams: {
            'Level 1 (128-bit)': { r: 12323, w: 142, t: 134, l: 256 },
            'Level 3 (192-bit)': { r: 24659, w: 206, t: 199, l: 256 },
            'Level 5 (256-bit)': { r: 40973, w: 274, t: 264, l: 256 }
        },
         comparison: {
            setup: { "Struktur": "Bit-Flipping Decoder", "Grundlage": "QC-MDPC Codes" },
            keygen: {
                "Größe Public Key": "1.541 Bytes",
                "Größe Secret Key": "3.082 Bytes",
                "CPU-Zyklen (kcc)": "~850" 
            },
            encaps: {
                "Größe Ciphertext": "1.541 Bytes",
                "CPU-Zyklen (kcc)": "~200"
            },
            decaps: {
                "Info": "Iterativer Decoder, DFR ist entscheidend.",
                "CPU-Zyklen (kcc)": "~1.700"
            },
            "Performanz-Quelle": "NIST PQC Round 3 Submission / AVX2 on Intel Skylake"
        },
        tabs: [
            { id: "setup", title: "Setup", contentFile: "setup.md"},
            { id: "keygen", title: "KeyGen", contentFile: "keygen.md" },
            { id: "encaps", title: "Encaps", contentFile: "encaps.md" },
            { id: "decaps", title: "Decaps", contentFile: "decaps.md" }
        ]
    },
    mceliece: {
        name: "Classic McEliece",
        levels: {
            'mceliece348864': 'Classic-McEliece-348864',
            'mceliece460896': 'Classic-McEliece-460896',
            'mceliece6688128': 'Classic-McEliece-6688128',
            'mceliece6960119': 'Classic-McEliece-6960119',
            'mceliece8192128': 'Classic-McEliece-8192128'
        },
        levelParams: {
            'mceliece348864':  { m: 12, n: 3488, t: 64, k: 2720 },
            'mceliece460896':  { m: 13, n: 4608, t: 96, k: 3360 },
            'mceliece6688128': { m: 13, n: 6688, t: 128, k: 5024 },
            'mceliece6960119': { m: 13, n: 6960, t: 119, k: 5413 },
            'mceliece8192128': { m: 13, n: 8192, t: 128, k: 6528 }
        },
        comparison: {
            setup: { "Struktur": "Algebraische Codes", "Grundlage": "Goppa-Codes" },
            keygen: {
                "Größe Public Key": "261.120 Bytes",
                "Größe Secret Key": "6.492 Bytes",
                "CPU-Zyklen (kcc)": ">200.000" 
            },
            encaps: {
                "Größe Ciphertext": "128 Bytes",
                "CPU-Zyklen (kcc)": "~50"
            },
            decaps: {
                "Info": "Komplexer, aber schneller algebraischer Decoder.",
                "CPU-Zyklen (kcc)": "~120"
            },
            "Performanz-Quelle": "NIST PQC Round 3 Submission / optimierte Implementierung auf Intel Skylake"
        },
        tabs: [
            { id: "setup", title: "Setup", contentFile: "setup.md"},
            { id: "keygen", title: "KeyGen", contentFile: "keygen.md" },
            { id: "encaps", title: "Encaps", contentFile: "encaps.md" },
            { id: "decaps", title: "Decaps", contentFile: "decaps.md" }
        ]
    }
};
