

  <h2>Grundlagen und Sicherheitslevel</h2>
  <p>
      HQC (Hamming Quasi-Cyclic) ist KEM, dessen Sicherheit auf der Schwierigkeit des Dekodierens von zufälligen quasi-zyklischen Codes beruht. Eine Besonderheit von HQC ist die Verwendung eines starken, öffentlich bekannten fehlerkorrigierenden Codes.
  </p>
  <p class="mt-4">Wähle ein Sicherheitslevel aus um die zugehörigen Parameter zu laden:</p>
  
 
  <div class="param-selector">
      {{level_selector_html}}
  </div>

---
  <h2>Aktive Systemparameter</h2>
  <p>Die folgenden Parameter definieren die Instanz des Kryptosystems</p>
  
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
              <td>Aktives Level</td>
              <td>-</td>
              <td><code>{{set_name}}</code></td>
              <td>Der Name des Parametersatzes laut Spezifikation.</td>
          </tr>
          <tr>
              <td>Ring-Dimension</td>
              <td>$n$</td>
              <td><code>{{n}}</code></td>
              <td>Die Dimension des Polynomrings $\mathcal{R}$.</td>
          </tr>
          <tr>
              <td>SK-Gewicht</td>
              <td>$w$</td>
              <td><code>{{w}}</code></td>
              <td>Das Hamming-Gewicht der privaten Schlüsselpolynome $x, y$.</td>
          </tr>
          <tr>
              <td>Fehler-Gewicht</td>
              <td>$w_e, w_r$</td>
              <td><code>{{t}}</code></td>
              <td>Das Hamming-Gewicht der Fehlervektoren $e, r_1, r_2$.</td>
          </tr>
      </tbody>
  </table>


---
<h2>Mathematische Grundlage: Der Polynomring</h2>
<strong>Definition:</strong> Der Ring wird definiert als $\mathcal{R} = \mathbb{F}_2[X]/(X^n - 1)$.

  <strong>Bedeutung:</strong> Dieser Ring besteht aus Polynomen mit Koeffizienten in $\mathbb{F}_2$ (0 oder 1). Alle Berechnungen finden **modulo** $X^n - 1$ statt. Für $n$ wird eine Primzahl gewählt, um Angriffe über die Faktorisierung von $X^n-1$ zu verhindern.
<details>
    <summary>Beispiel für ein Polynom in $\mathcal{R}$</summary>
    <div>
        <p>Ein Polynom $p(X)$ im Ring für HQC-128 (mit $n=17669$) könnte zum Beispiel so aussehen:</p>
        <p>$$ p(X) = X^{17660} + X^{1234} + X^5 + 1 $$</p>
        <p>Jedes Polynom kann als Vektor seiner Koeffizienten dargestellt werden, der in diesem Fall die Länge 17669 hätte.</p>
    </div>
</details>


---
<h2>Der fehlerkorrigierende Code</h2>
<p>HQC nutzt explizit zwei starke, öffentlich bekannte Codes zur Fehlerkorrektur in einer verketteten (konkatenierten) Struktur:</p>
<strong>Äußerer Code:</strong> Ein Reed-Solomon Code über dem Körper $\mathbb{F}_{2^8}$.
<strong>Innerer Code:</strong> Ein (duplizierter) Reed-Muller Code.

<details>
    <summary>Zweck und Interaktion der Codes</summary>
    <p>Die Sicherheit von HQC beruht nicht auf der Geheimhaltung des Codes. Stattdessen wird ein sehr leistungsfähiger, öffentlich bekannter Code verwendet, um eine extrem niedrige Dekodierungsfehlerrate (DFR) zu garantieren.</p>
    <p>Der Kodierungsprozess funktioniert so:</p>
    <ol>
        <li>Eine Nachricht $m$ wird zuerst vom <strong>äußeren Reed-Solomon-Code</strong> in eine Sequenz von Symbolen aus $\mathbb{F}_{2^8}$ (also Bytes) kodiert.</li>
        <li>Anschließend wird jedes dieser Symbole vom <strong>inneren Reed-Muller-Code</strong> in einen längeren binären Vektor umgewandelt.</li>
    </ol>
    <p>Das Ergebnis ist ein sehr langes binäres Codewort. Bei der Entschlüsselung wird dieser Prozess umgekehrt: Zuerst dekodiert der innere Code die binären Blöcke zurück zu Symbolen (und korrigiert dabei Bit-Fehler), und dann dekodiert der äußere Code die Sequenz von Symbolen zurück zur ursprünglichen Nachricht (und korrigiert dabei Symbol-Fehler).</p>
</details>


---
<h2>Kryptographische Funktionen</h2>
<p>HQC verwendet zwei auf SHAKE256 basierende Hash-Funktionen, $\mathcal{G}$ und $\mathcal{K}$:</p>
<ul>
    <li>
        <strong>Funktion $\mathcal{G}$:</strong>
        <ul>
            <li><strong>Definition:</strong> SHAKE256 mit Domain Separation</li>
            <li><strong>Zweck:</strong> Erzeugt aus einer Nachricht $m$, dem öffentlichen Schlüssel und einem Salt den Seed $\theta$.</li>
        </ul>
    </li>
    <li>
        <strong>Funktion $\mathcal{K}$:</strong>
        <ul>
            <li><strong>Definition:</strong> SHAKE256 mit Domain Separation</li>
            <li><strong>Zweck:</strong> Leitet den finalen Schlüssel $K$ aus der Nachricht $m$ und dem Chiffrat $c$ ab.</li>
        </ul>
    </li>
</ul>
<details>
    <summary>Domain Separation</summary>
    <p>Zur Kollisionsvermeidung werden Hash-Inputs durch Suffixe getrennt. Zum Beispiel:</p>
    <div class="code-block">
        <p>$\mathcal{G}(x) = \text{SHAKE256}(x \ || \ \text{G_FCT_DOMAIN})$</p>
        <p>$\mathcal{K}(x) = \text{SHAKE256}(x \ || \ \text{K_FCT_DOMAIN})$</p>
    </div>
</details>
