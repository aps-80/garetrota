# Gare Trota

Programma per le gare di pesca alla trota dell'A.P.S. 80: soci, quote, iscrizioni, pesate, classifiche, stampe A4, cena sociale, lotteria e bilancio. È una PWA usata su tablet e PC, anche senza internet. È pubblicata con GitHub Pages da `main`.

## File
- `index.html`: tutto il programma (HTML, CSS e JS). **È grande: non leggerlo per intero.** Cerca con grep la funzione o la sezione che ti serve (es. `menuSezione`, `campoSomma`, `Sync`, `cena`) e leggi solo quel pezzo.
- `sw.js`: service worker con `VERSIONE`.
- `manifest.json`, `icons/`: installazione come app.
- `firebase-config.js`: configurazione web di Firebase (la apiKey non è un segreto).
- Le regole Firestore e il worker per le foto **non sono in questo repository**. Se il compito li tocca, fermati e avvisa.

## Regole
- A ogni modifica di `index.html` aumenta la versione (maggiore.minore.correzione), sia in `VERSIONE` di `sw.js` sia in `VERSIONE_APP` di `index.html`.
- Non rompere la sincronizzazione: confronto a tre vie (dispositivo, server, base in localStorage), "Modifiche scartate" in caso di conflitto, documenti `archivio/g_<id>`, `soci`, `impostazioni`, `logo`, `resto` nella forma `{j, t, da}`.
- Niente aggiornamento automatico: resta il pulsante "Nuova versione: Aggiorna", così una pesata a metà non si perde.
- Interfaccia: pulsanti blu per stampare, verdi per fare, arancio per andare a un'altra pagina. Icone SVG, niente emoji.
- Prove: server locale che serve questa cartella, solo con dati inventati, mai con l'archivio vero.
- Mai segreti nel repository.

## Lavoro nei thread
- Tocca solo i file assegnati nel brief. Se serve una scelta, chiedi all'utente.
- Lavora sul tuo branch e apri una pull request. Non unire in `main` e non seguire la PR dopo averla aperta.
- Alla fine scrivi un resoconto di massimo 10 righe: cosa è cambiato, file, versione, cosa è provato e cosa no.
- Utente italiano, non programmatore: spiegazioni semplici, in italiano.
