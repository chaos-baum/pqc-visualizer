<h2>Grundlagen und Auswahl des Parametersatzes</h2>
<p>Classic McEliece ist eines der ältesten und am besten untersuchten Public-Key-Kryptosysteme. Seine Sicherheit beruht auf der Schwierigkeit, einen allgemeinen linearen Code zu dekodieren (Syndrom-Dekodierungs-Problem). Die "klassische" Variante verwendet hochstrukturierte binäre Goppa-Codes, deren Struktur im öffentlichen Schlüssel verschleiert wird. Charakteristisch sind die sehr großen öffentlichen Schlüssel und die sehr kleinen Chiffrate.</p>

<p>Wählen Sie eine Variante aus, um die zugehörigen Parameter zu laden:</p>
{{level_selector_html}}

---

<h2>Aktive Systemparameter</h2>
<p>Die folgenden Parameter definieren die Instanz des Kryptosystems.</p>

<table class="param-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Symbol</th>
            <th>Wert</th>
            <th>Beschreibung</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Aktiver Satz</td>
            <td>-</td>
            <td><code>{{set_name}}</code></td>
            <td>Der Name des Parametersatzes laut Spezifikation.</td>
        </tr>
        <tr>
            <td>Körper-Grad</td>
            <td>$m$</td>
            <td><code>{{m}}</code></td>
            <td>Definiert die Größe des endlichen Körpers $\mathbb{F}_{2^m}$.</td>
        </tr>
        <tr>
            <td>Code-Länge</td>
            <td>$n$</td>
            <td><code>{{n}}</code></td>
            <td>Die Länge der Codewörter.</td>
        </tr>
        <tr>
            <td>Fehlergewicht</td>
            <td>$t$</td>
            <td><code>{{t}}</code></td>
            <td>Die garantierte Fehlerkorrektur-Kapazität des Goppa-Codes.</td>
        </tr>
        <tr>
            <td>Code-Dimension</td>
            <td>$k$</td>
            <td><code>{{k}}</code></td>
            <td>Die Länge der Nachricht. Berechnet als $k = n - mt$.</td>
        </tr>
    </tbody>
</table>

---

<h2>Algebraische Strukturen</h2>
<p>Ein zentraler Teil des Setups ist die Festlegung der endlichen Körper, in denen die Berechnungen stattfinden. Diese werden durch irreduzible Polynome definiert, die für jeden Parametersatz fest vorgegeben sind.</p>
<ul>
    <li><strong>Definition des Körpers $\mathbb{F}_{2^m}$</strong>:
        <ul>
            <li>Ein festes, irreduzibles Polynom $f(z) \in \mathbb{F}_2[z]$ vom Grad $m$.</li>
            <li>Der Körper wird als Restklassenring $\mathbb{F}_{2^m} \cong \mathbb{F}_2[z]/f(z)$ konstruiert.</li>
        </ul>
    </li>
</ul>
<details>
    <summary>Beispiel für `mceliece348864` </summary>
    <p>Für diesen Parametersatz sind die definierenden Polynome:</p>
    <ul>
        <li>$m=12$</li>
        <li>$f(z) = z^{12} + z^3 + 1$ (definiert $\mathbb{F}_{2^{12}}$)</li>
    </ul>
    <p>Diese Polynome sind nicht geheim, sondern Teil der globalen Systemdefinition und garantieren die korrekte mathematische Struktur.</p>
</details>

---

<h2>Symmetrische Kryptographie-Parameter</h2>
<p>Classic McEliece verwendet Standard-Hashfunktionen und einen Pseudozufallszahlengenerator (PRG) für verschiedene interne Schritte. Diese sind für alle Parametersätze identisch.</p>
<ul>
    <li><strong>Hash-Funktion $H$</strong>:
        <ul>
            <li><strong>Definition:</strong> SHAKE256</li>
            <li><strong>Zweck:</strong> Wird zur Ableitung des gemeinsamen Schlüssels $K$ aus dem Fehlervektor $e$ und dem Chiffrat $C$ verwendet.</li>
        </ul>
    </li>
    <li><strong>Pseudozufallsgenerator $G$</strong>:
        <ul>
            <li><strong>Definition:</strong> SHAKE256 mit Domain Separation.</li>
            <li><strong>Zweck:</strong> Erzeugt aus einem initialen Seed $\delta$ alle für die Schlüsselgenerierung benötigten Zufallswerte.</li>
        </ul>
    </li>
    <li><strong>Länge des Seeds/Keys $l$</strong>:
        <ul>
            <li><strong>Definition:</strong> $l=256$ Bits.</li>
        </ul>
    </li>
</ul>
<details>
    <summary>Domain Separation </summary>
    <p>Um sicherzustellen, dass die Aufrufe von `SHAKE256` für verschiedene Zwecke nicht kollidieren, wird Domain Separation verwendet. Beispielsweise wird $G(\delta)$ als `SHAKE256(0x40 || \delta)` und $H(b, e, C)$ als `SHAKE256(b || e || C)` aufgerufen, wobei `b` ein Byte (0x00 oder 0x01) ist. Dies stellt sicher, dass die Hash-Inputs für $G$ und $H$ niemals identisch sein können.</p>
</details>
