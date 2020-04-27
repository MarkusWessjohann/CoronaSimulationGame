# CoronaSimulationGame

Das Corona Simulationsspiel ist ein Prototyp für ein Spiel Rund um den Corona-Virus.
Ziel ist es so lange wie möglich zu überleben.

## Getting Started

Um das Spiel zu Spielen, reicht es aus das entsprechende Zip-Archiv herunterzulanden und entpacken.
In dem Ordner findet ihr die Datei _index.html_ im Verzeichnis _\src\CoronaSimulationGame_JavaScript_.
Diese Datei mit dem Browser öffnen.

Die Zip-Archive findet ihr unter Releases.

### Prerequisites


## Anleitung zum Spiel

Sobald ihr das Spiel startet, fangt ihr mit einer Population von 10 Personen an. Eine Person seit ihr (hellblau) und kann durch euch mit den Cursor-Tasten gesteuert werden.
Eine weiter Person ist mit Corona infiziert (rot) und die restlichen (blau) sind noch gesund.

Beim ersten Kontakt mit der infizierten Person, wird die betreffende Person infiziert.
Nach einer gewissen Zeit werden die infizierten Personen wieder gesund (grün) oder sterben (schwarz).
Falls sie überleben sind sie gegen Corona immun und stecken sich und andere Personen nicht mehr an.
Das Level endet, wenn es keine infizierte Person mehr gibt.

Ist die Level zu Ende, wird eine kleine Statistik angezeigt und die nächste Level beginnt nach einem Space.

Das Spiel endet nicht, wenn man infiziert (orange) wurde, nur wenn man daran stirbt (dunkel grau)!

Stirbt man wird eine Gesamtstatistik angezeigt und das Spiel kann mittels STRG neu gestartet werden.
.
## Authors

* Markus Wessjohann - *Initial Work* - [MarkusWessjohann](https://github.com/MarkusWessjohann)

# License

This projekt is licensed under GPL-3.0 - see the [LICENSE](https://github.com/MarkusWessjohann/CoronaSimulationGame/blob/master/LICENSE)
