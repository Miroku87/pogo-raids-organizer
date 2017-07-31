const TEXTS = {
    "it" : {
        "errors": {
            raidTooCloseToAnother: "Il raid inserito potrebbe essere un duplicato. Controllare sulla mappa che non sia gi&agrave; stato segnalato.",
            missingPokeName: "Se il raid &egrave; gi&agrave; iniziato inserire il nome del Pok&eacute;mon.",
            startTimeOrCountdownMissing: "Almeno un campo tra <code>Orario di Inizio</code> e <code>Minuti Rimanenti</code> deve essere compilato."
        },
        "labels": {
            errorTitle: "Errore"
        }
    }
};

export default class TextsManager
{
    static getText = ( lang, type, name, ...replacings ) =>
    {
        let text = TEXTS[lang][type][name],
            reg = null;

        replacings.forEach(( word, index ) =>
        {
            reg = new RegExp( "\\{" + index + "\\}", "gi" );
            text = text.replace( reg, word );
        } );

        return text;
    }
}