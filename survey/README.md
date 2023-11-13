# Survey

Our survey was conducted among research assistants and students with advanced SQL experience. 

The survey tool utilized for this purpose was [LamaPool](https://www.lamapoll.de/).

The results of the survey can be viewed in their original form in the `results` folder, or in a readable format later in this Markdown file.

The original survey was saved as an HTML file in the `snapshots` folder.

Since the survey was conducted in German, we will translate each page of the survey into English in the following sections (translated using ChatGPT and manually verified for accuracy). Additionally, the results of each individual scenario (from page 3 onwards) will be presented in a more readable format:

## Page 1

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Vergleich von SQL Bewertungs-Verfahren</h3>
In dieser Umfrage sollen <strong>3 Bewertungs-Verfahren</strong> für SQL Übungsaufgaben bezüglich ihrer <strong>Fairness</strong> und <strong>Nachvollziehbarkeit</strong> verglichen werden.

Die <strong>Umfrage</strong> ist folgendermaßen strukturiert:

Zunächst werden auf der nächsten Seite die <strong>Bewertungs-Verfahren</strong> vorgestellt. Bitte nehmen Sie sich die Zeit, die Erklärungen sorgfältig zu lesen, um auf den darauf folgenden Seiten eine fundierte Bewertung der <strong>Fairness</strong> und <strong>Nachvollziehbarkeit</strong> der einzelnen Korrekturen vornehmen zu können.

Danach folgen 11 Szenarien, welche jeweils folgendermaßen aufgebaut sind:
- Zu Beginn finden Sie jeweils die <strong>Aufgabenstellung</strong>, die ein <strong>Datenbankschema</strong> beinhaltet (es handelt sich dabei stets um dieselbe Datenbank), sowie eine <strong>Beschreibung der gesuchten Daten</strong> (es handelt sich oft mehrmals hintereinander um dieselbe Aufgabenstellung, gekennzeichnet durch eine Kennzahl).
- Dazu gibt es jeweils die <strong>Musterlösung</strong> (ändert sich nur dann, wenn sich auch die Aufgabenstellung ändert),
- Sowie eine tatsächliche <strong>Antwort von</strong> (anonymen) <strong>Studierenden</strong>, die die Aufgabe im Zuge ihrer Prüfungsvorbereitung bearbeitet haben (hier handelt es sich in jedem Szenario um eine andere, ebenfalls gekennzeichnet durch eine Kennzahl).
- Und schließlich folgen für die <strong>drei Bewertungs-Verfahren</strong> jeweils die Interpretation der <strong>Musterlösung</strong>, die Korrektur der <strong>studentischen Antwort</strong> und die resultierende <strong>Bewertung</strong>.

Ihre Aufgabe ist es, diese <strong>Bewertungen</strong> jeweils bezüglich ihrer <strong>Fairness</strong> und <strong>Nachvollziehbarkeit</strong> zu vergleichen.

Beachten Sie, dass die <strong>Reihenfolge der Bewertungsverfahren</strong> <strong>stets zufällig</strong> ist, um die Umfrage unparteiisch zu halten.

Die Bearbeitung wird ca. 30 min dauern.

Wir bedanken uns bereits im Voraus herzlich für Ihre Teilnahme!

<h4>Datenschutzerklärung</h4>

Die ​gesammelten Daten werden anonym gespeichert. Es sind keine Rückschlüsse auf Ihre Person möglich.
Die Daten dienen zu Forschungszwecken und können anonym im Rahmen einer wissenschaftlichen Publikation veröffentlicht werden.

x Ich bestätige hiermit, dass ich mit der Datenschutzerklärung einverstanden bin.

<h4>Einverständniserklärung</h4>

Indem Sie an der Umfrage teilnehmen bestätigen Sie, dass Sie mindestens 18 Jahre alt sind, an dieser Studie freiwillig teilnehmen und dass Sie diese Studie jederzeit abbrechen können, ohne dass Ihnen dadurch ein Nachteil entsteht.

x Ich bestätige hiermit, dass ich mit der Einverständniserklärung einverstanden bin.
    </td>
    <td width="50%">
<h3>Comparison of SQL Evaluation Methods</h3>
In this survey, we aim to compare <strong>3 evaluation methods</strong> for SQL exercises in terms of their <strong>fairness</strong> and <strong>transparency</strong>.
      
The <strong>survey</strong> is structured as follows:

Initially, on the next page, the <strong>evaluation methods</strong> will be introduced. Please take the time to read the explanations carefully to be able to make an informed assessment of the <strong>fairness</strong> and <strong>transparency</strong> of each correction on the subsequent pages.

This is followed by 11 scenarios, each structured as follows:
- Firstly, you will find the <strong>task description</strong>, which includes a <strong>database schema</strong> (always the same database), and a <strong>description of the data sought</strong> (often the same task description repeated, indicated by a code).
- Then, there is the <strong>model solution</strong> (which changes only if the task description changes),
- Along with an actual <strong>response from</strong> (anonymous) <strong>students</strong> who have worked on the task as part of their exam preparation (each scenario features a different response, also indicated by a code).
- Finally, there are interpretations of the <strong>model solution</strong>, corrections of the <strong>student response</strong>, and the resulting <strong>evaluation</strong> for each of the <strong>three evaluation methods</strong>.

Your task is to compare these <strong>evaluations</strong> in terms of their <strong>fairness</strong> and <strong>transparency</strong>.

Note that the <strong>order of the evaluation methods</strong> is <strong>always random</strong> to maintain impartiality in the survey.

The survey will take approximately 30 minutes to complete.

We thank you in advance for your participation!

<h4>Privacy Policy</h4>

The collected data will be stored anonymously. It is not possible to deduce your personal information from this data.
The data is used for research purposes and may be published anonymously in a scientific publication.

x I hereby confirm that I agree with the Privacy Policy.

<h4>Consent Form</h4>

By participating in the survey, you confirm that you are at least 18 years old, that you are participating in this study voluntarily, and that you can withdraw from this study at any time without incurring any disadvantage.

x I hereby confirm that I agree with the Consent Form.
    </td>
  </tr>
</table>

## Page 2

In the survey tool, the order of the three descriptions is randomized to avoid bias due to the sequence.

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Die drei Bewertungs-Verfahren</h3>
<h4>Ergebnisbasierte Bewertung</h4>
Um eine <strong>studentische Antwort </strong>zu bewerten, werden sowohl die <strong>Musterlösung</strong>, als auch die <strong>studentische Antwort </strong>auf einer Testdatenbank ausgeführt und anschließend die <strong>Ergebnisrelationen </strong>bezüglich folgender Werte verglichen. Für jede <strong>Aufgabenstellung</strong> werden jedem dieser Werte einzelne maximale Punkte zugewiesen; die Bewertung berechnet sich schlicht als Summe der Teilpunktzahlen:
<ul><li><strong>Anzahl der Tupel</strong>:<br />Wenn die <strong>studentische Antwort </strong>dieselbe Anzahl an Tupeln liefert wie die <strong>Musterlösung</strong>, werden<strong> </strong>maximale Punkte vergeben, andernfalls 0.</li>
<li><strong>Namen der Attribute</strong>:<br />Die Attributnamen in der <strong>Ergebnisrelation</strong> der <strong>studentischen Antwort</strong> werden mit denen der <strong>Musterlösung</strong> über die Jaccard-Distanz verglichen (Punkte = Maximale Punkte * (1 - Jaccard Distanz)). Die Reihenfolge und Groß-/Kleinschreibweise der Attributnamen ist dabei irrelevant. </li>
<li><strong>Funktionale Abhängigkeiten</strong>:<br />Die funktionalen Abhängigkeiten in der <strong>Ergebnisrelation </strong>der <strong>studentischen Antwort</strong> werden mit denen in der <strong>Musterlösung</strong> verglichen, ebenfalls über die Jaccard-Distanz (Punkte = Maximale Punkte * (1 - Jaccard Distanz)). Die Reihenfolge und Bezeichnung der Attribute ist auch hier irrelevant. </li></ul>

<h4>Manuelle Bewertung</h4>
Um eine <strong>studentische Antwort</strong> zu bewerten, wird diese händisch auf Unterschiede zur <strong>Musterlösung </strong>untersucht. 

Hierfür wird zunächst ein <strong>Bewertungsschema </strong>für die <strong>Musterlösung </strong>festgelegt. Dieses orientiert sich generell an den natürlichen Blöcken, aus denen die Anfrage aufgebaut ist. 

Eine <strong>studentische Antwort</strong> wird bewertet, indem jedes Kriterium des <strong>Bewertungsschemas </strong>einzeln darauf geprüft wird, ob die studentische Antwort mit diesem übereinstimmt. Dabei werden für Ungenauigkeiten nicht unbedingt volle Punkte abgezogen/nicht gegeben, sondern je nach Schwere des Fehlers unter Umständen auch nur halbe oder gar keine.

<h4>Distanzbasierte Bewertung</h4>
Um eine <strong>studentische Antwort</strong> zu bewerten, werden ihre <strong>semantischen Unterschiede</strong> zur <strong>Musterlösung </strong>untersucht. Diese Unterschiede werden durch <strong>Transformationen </strong>verkörpert, welche jeweils spezifische Änderungen an einer SQL-Anfrage durchführen und sie dadurch in eine andere verwandeln. Durch das Verketten von <strong>Transformationen </strong>kann so jede SQL-Anfrage in jede andere umgewandelt werden. Alle <strong>Transformationen </strong>haben individuelle <strong>Kosten</strong>, die die Größe des <strong>semantischen Unterschieds</strong> beziffern, welcher durch sie verkörpert wird. (Äquivalenzumformungen haben dementsprechend Kosten von 0.) Die <strong>semantische Distanz</strong> zwischen zwei gegebenen SQL-Anfragen ist definiert als die geringstmögliche <strong>Summe an </strong><strong>Kosten </strong>für eine <strong>Verkettung von Transformationen</strong>, welche die eine Anfrage in die andere verwandelt.

Je größer die <strong>semantische Distanz</strong> zwischen <strong>studentischer Antwort</strong> und <strong>Musterlöung</strong>, desto weniger Punkte bekommt die <strong>studentische Antwort</strong>. Dafür wird vorher die <strong>Schwierigkeit</strong> der <strong>Musterlösung </strong>beziffert. Von dieser <strong>Schwierigkeit</strong> wird die <strong>semantische Distanz</strong> abgezogen (und nach unten auf 0 begrenzt), was einen Wert zwischen 0 und <strong>Distanz</strong> liefert. Dieser Wert wird schließlich auf den Bereich zwischen 0 und <strong>Maximale Punkte</strong> der Aufgabe skaliert.

Es ergibt sich folgende <strong>Formel</strong>:

<strong>Punkte </strong>= (<strong>Schwierigkeit </strong>- <strong>Distanz</strong>) / <strong>Schwierigkeit </strong>* <strong>Maximale Punkte</strong>
    </td>
    <td width="50%">
<h3>The three evaluation methods</h3>
<h4>Result-Based Evaluation</h4>
To evaluate a <strong>student response</strong>, both the <strong>model solution</strong> and the <strong>student response</strong> are executed on a test database, and then the <strong>result relations</strong> are compared in terms of the following values. For each <strong>task</strong>, individual maximum points are assigned to each of these values; the evaluation is simply calculated as the sum of the partial point scores:
<ul><li><strong>Number of tuples</strong>:<br />If the <strong>student response</strong> yields the same number of tuples as the <strong>model solution</strong>, maximum points are awarded, otherwise 0.</li>
<li><strong>Names of attributes</strong>:<br />The attribute names in the <strong>result relation</strong> of the <strong>student response</strong> are compared with those of the <strong>model solution</strong> using the Jaccard distance (Points = Maximum points * (1 - Jaccard Distance)). The order and case (upper/lower) of the attribute names are irrelevant.</li>
<li><strong>Functional dependencies</strong>:<br />The functional dependencies in the <strong>result relation</strong> of the <strong>student response</strong> are compared with those in the <strong>model solution</strong>, also using the Jaccard distance (Points = Maximum points * (1 - Jaccard Distance)). The order and naming of the attributes are also irrelevant here. </li></ul>

<h4>Manual Evaluation</h4>
To evaluate a <strong>student response</strong>, it is manually examined for differences from the <strong>model solution</strong>.

For this purpose, a <strong>grading scheme</strong> is first established for the <strong>model solution</strong>. This generally follows the natural blocks that make up the query.

A <strong>student response</strong> is evaluated by individually checking each criterion of the <strong>grading scheme</strong> to see if the student's response matches it. In the case of inaccuracies, full points are not necessarily deducted/not awarded; depending on the severity of the error, only half points or none at all may be deducted.

<h4>Distance-Based Evaluation</h4>
To evaluate a <strong>student response</strong>, its <strong>semantic differences</strong> from the <strong>model solution</strong> are examined. These differences are represented by <strong>transformations</strong> that make specific changes to an SQL query, thereby converting it into another form. By chaining <strong>transformations</strong>, any SQL query can be transformed into any other. Each <strong>transformation</strong> has individual <strong>costs</strong>, which quantify the size of the <strong>semantic difference</strong> embodied by it. (Equivalence transformations, accordingly, have costs of 0.) The <strong>semantic distance</strong> between two given SQL queries is defined as the smallest possible <strong>sum of costs</strong> for a <strong>chain of transformations</strong> that converts one query into the other.

The greater the <strong>semantic distance</strong> between the <strong>student response</strong> and the <strong>model solution</strong>, the fewer points the <strong>student response</strong> receives. To determine this, the <strong>difficulty</strong> of the <strong>model solution</strong> is first quantified. The <strong>semantic distance</strong> is subtracted from this <strong>difficulty</strong> (and limited to a minimum of 0), resulting in a value between 0 and the <strong>difficulty</strong>. This value is then scaled to the range between 0 and the <strong>maximum points</strong> for the task.

The following <strong>formula</strong> is derived:

<strong>Points</strong> = (<strong>Difficulty</strong> - <strong>Distance</strong>) / <strong>Difficulty</strong> * <strong>Maximum Points</strong>
    </td>
  </tr>
</table>

## Page 3 

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Szenario 1-1</h3>
<h4>Aufgabenstellung 1</h4>
Diese Datenbank ist an den Musterstudienplan im Informatik Bachelorstudiengang angelehnt. Sie ist auf dem Stand von Wintersemester 2019/20 und besteht aus vier Relationen:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Geben Sie für jedes Modul die Bezeichnung des Moduls, das dazugehörige Semester und ECTS aus.

Die Maximale Punktzahl beträgt 3.
<h4>Musterlösung</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Studentische Antwort 1</h4>
<code>SELECT modul, semester, ects
FROM modul_semester;</code>
<h4><b>Manuelle Bewertung: 1,5 / 3</b></h4>
<h5>Musterlösung:</h5>
<img src="img/scenario-1-1-sample.png"/>
<h5>Studentische Antwort:</h5>
<img src="img/scenario-1-1-student.png"/>
<h5>Bewertung:</h5>
Punkte = 1,5
<h4><b>Distanzbasierte Bewertung: 1,5 / 3</b></h4>
<h5>Musterlösung:</h5>
Difficulty: 14
<h5>Studentische Antwort:</h5>
<strong>Total Distance: 7</strong>


SELECT modul, semester, ects FROM modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Change (incorrect) column-reference column in a select-element expression.

SELECT bezeichnung, semester, ects FROM modul_semester;

&gt;&gt;&gt; <strong>Cost 2</strong>: Add (missing) element in from-clause.

SELECT bezeichnung, semester, ects FROM modul, modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Set complex join-type on a from-element (change cross join to a complex join).

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) binary-expression to a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (    =    );

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) column-reference to a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id =    );

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) column-reference to a from-element join-condition.
SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);
<h5>Bewertung:</h5>
Punkte = (14 - 7) / 14 * 3 = 1,5
<h4><b>Ergebnisbasierte Bewertung: 2,7 / 3</b></h4>
<h5>Musterlösung:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Maximale<br />Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>26<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>

<h5>Studentische Antwort:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>26<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["modul",<br />"semester",<br />"ects"]<br /></td>
            <td>0.667<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"modul\",<br />\"semester\"],<br />\"dependentAtt.\":<br />\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>

<h5>Bewertung:</h5>
Punkte = 1 + 0.66666666666667 + 1 = 2,7

<h4>Fairness:</h4> Geben Sie an, wie <b>fair</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Mittel</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Nachvollziehbarkeit:</h4> Geben Sie an, wie <b>nachvollziehbar</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Gut<br />nachvoll-<br />ziehbar</th>
    <th>Mittel</th>
    <th>Schlecht<br />nachvoll-<br />ziehbar</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
    <td width="50%">
<h3>Scenario 1-1</h3>
<h4>Task 1</h4>
This database is modeled after the standard curriculum of the Bachelor's program in Computer Science. It reflects the status as of the winter semester 2019/20 and comprises four relations:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Provide the name of each module, the corresponding semester, and ECTS credits.

The maximum score is 3.
<h4>Sample Solution</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Student Response 1</h4>
<code>SELECT modul, semester, ects
FROM modul_semester;</code>
<h4><b>Manual Evaluation: 1,5 / 3</b></h4>
<h5>Sample Solution:</h5>
<img src="img/scenario-1-1-sample.png"/>
<h5>Student Reponse:</h5>
<img src="img/scenario-1-1-student.png"/>
<h5>Evaluation:</h5>
Points = 1.5
<h4><b>Distance-Based Evaluation: 1,5 / 3</b></h4>
<h5>Sample Solution:</h5>
Difficulty: 14
<h5>Student Reponse:</h5>
<strong>Total Distance: 7</strong>


SELECT modul, semester, ects FROM modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Change (incorrect) column-reference column in a select-element expression.

SELECT bezeichnung, semester, ects FROM modul_semester;

&gt;&gt;&gt; <strong>Cost 2</strong>: Add (missing) element in from-clause.

SELECT bezeichnung, semester, ects FROM modul, modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Set complex join-type on a from-element (change cross join to a complex join).

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester;

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) binary-expression to a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (    =    );

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) column-reference to a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id =    );

&gt;&gt;&gt; <strong>Cost 1</strong>: Add (missing) column-reference to a from-element join-condition.
SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);
<h5>Evaluation:</h5>
Points = (14 - 7) / 14 * 3 = 1,5
<h4><b>Result-Based Evaluation: 2,7 / 3</b></h4>
<h5>Sample Solution:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Maximum<br />Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>26</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>
<h5>Student Reponse:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>26</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["modul",<br />"semester",<br />"ects"]<br /></td>
            <td>0.667<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"modul\",<br />\"semester\"],<br />\"dependentAtt.\":<br />\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>
<h5>Evaluation:</h5>
Points = 1 + 0.66666666666667 + 1 = 2,7

<h4>Fairness:</h4> Indicate how <b>fair</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally fair.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Moderate</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Comprehensibility:</h4> Indicate how <b>comprehensible</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally comprehensible.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Easy<br />to<br />comprehend</th>
    <th>Moderate</th>
    <th>Difficult<br />to<br />comprehend</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
  </tr>
</table>

### Results

The survey results for this scenario are as follows:

| ID | DATE     | Fairness Result-Based | Fairness Distance-Based | Fairness Manual | Comprehensibility Result-Based | Comprehensibility Distance-Based | Comprehensibility Manual |
| -- | -------- | --------------- | --------------------- | --------------------- | ---------------------- | --------------------- | --------------------- |
| 1  | 12.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 2  | 13.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 3  | 17.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 4  | 21.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 5  | 24.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 6  | 24.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 7  | 26.07.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 8  | 02.08.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 9  | 02.08.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 10 | 04.08.23 | 3               | 2                     | 1                     | 1                      | 2                     | 3                     |
| 11 | 04.08.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 12 | 07.08.23 | 1               | 1                     | 1                     | 2                      | 2                     | 2                     |
| 13 | 07.08.23 | \-1             | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 14 | 07.08.23 | 3               | 1                     | 1                     | 1                      | 1                     | 2                     |
| 15 | 07.08.23 | 3               | 1                     | 1                     | 2                      | 1                     | 1                     |
| 16 | 07.08.23 | 1               | 2                     | 1                     | 1                      | 1                     | 1                     |
| 17 | 07.08.23 | 1               | 1                     | 1                     | 1                      | 1                     | 1                     |
| 18 | 07.08.23 | 3               | 1                     | 1                     | 1                      | 3                     | 1                     |
| 19 | 08.08.23 | 2               | 1                     | 1                     | 1                      | 2                     | 1                     |
| 20 | 08.08.23 | 3               | 1                     | 1                     | 2                      | 3                     | 1                     |
| 21 | 08.08.23 | 1               | 1                     | 1                     | 3                      | 2                     | 1                     |
| 22 | 09.08.23 | 2               | 1                     | 2                     | 3                      | 1                     | 2                     |
| 23 | 18.08.23 | 1               | 2                     | 2                     | 1                      | 2                     | 1                     |
| 24 | 15.08.23 | 3               | 1                     | 1                     | 2                      | 1                     | 1                     |
| 25 | 17.08.23 | 2               | 1                     | 1                     | 1                      | 1                     | 2                     |
| 26 | 18.08.23 | \-1             | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 27 | 23.08.23 | 3               | 2                     | 2                     | 2                      | 3                     | 1                     |
| 28 | 28.08.23 | 2               | 1                     | 1                     | 1                      | 1                     | 1                     |
| 29 | 29.08.23 | 2               | 2                     | 2                     | 2                      | 2                     | 2                     |
| 30 | 29.08.23 | 2               | 1                     | 1                     | 2                      | 2                     | 1                     |
| 31 | 31.08.23 | \-2             | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 32 | 01.09.23 | 3               | 1                     | 1                     | 3                      | 1                     | 1                     |
| 33 | 01.09.23 | 3               | 1                     | 1                     | 2                      | 2                     | 1                     |
| 34 | 01.09.23 | \-1             | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 35 | 04.09.23 | \-1             | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |

#### Legend:
- "1" represents the selection of the best option
- "0" indicates the selection of the moderate option
- "-1" signifies the selection of the worst option
- "-2" denotes no selection made by participants

## Page 4 

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Szenario 1-2</h3>
<h4>Aufgabenstellung 1</h4>
Diese Datenbank ist an den Musterstudienplan im Informatik Bachelorstudiengang angelehnt. Sie ist auf dem Stand von Wintersemester 2019/20 und besteht aus vier Relationen:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Geben Sie für jedes Modul die Bezeichnung des Moduls, das dazugehörige Semester und ECTS aus.

Die Maximale Punktzahl beträgt 3.
<h4>Musterlösung</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Studentische Antwort 2</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects 
FROM modul m 
JOIN modul_semester ms ON m.id = ms.modul 
GROUP BY m.bezeichnung;</code>

<h4><b>Manuelle Bewertung: 2 / 3</b></h4>
<h5>Musterlösung:</h5>
<img src="img/scenario-1-2-sample.png"/>
<h5>Studentische Antwort:</h5>
<img src="img/scenario-1-2-student.png"/>
<h5>Bewertung:</h5>
Punkte = 2

<h4><b>Distanzbasierte Bewertung: 2,6 / 3</b></h4>
<h5>Musterlösung:</h5>
Difficulty: 14
<h5>Studentische Antwort:</h5>
<strong>Total Distance: 2</strong>


SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY bezeichnung;

&gt;&gt;&gt; <strong>Cost 2</strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);

<h5>Bewertung:</h5>
Punkte = (14 - 2) / 14 * 3 = 2,5714285714

<h4><b>Ergebnisbasierte Bewertung: 1 / 3</b></h4>
<h5>Musterlösung:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Maximale<br />Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>26<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>

<h5>Studentische Antwort:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>23<br /></td>
            <td>0<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\"],<br />\"dependentAtt.\":<br />[\"semester\"]}",<br />"{\"determinateAtt.\":<br />[\"bezeichnung\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>0<br /></td>
        </tr>
    </tbody>
</table>

<h5>Bewertung:</h5>
Punkte = 0 + 1 + 0 = 1

<h4>Fairness:</h4> Geben Sie an, wie <b>fair</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!<br />
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Mittel</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Nachvollziehbarkeit:</h4> Geben Sie an, wie <b>nachvollziehbar</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!<br />
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Gut<br />nachvoll-<br />ziehbar</th>
    <th>Mittel</th>
    <th>Schlecht<br />nachvoll-<br />ziehbar</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
    <td width="50%">
<h3>Scenario 1-2</h3>
<h4>Task 1</h4>
This database is modeled after the standard curriculum of the Bachelor's program in Computer Science. It reflects the status as of the winter semester 2019/20 and comprises four relations:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Provide the name of each module, the corresponding semester, and ECTS credits.

The maximum score is 3.
<h4>Sample Solution</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Student Response 2</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects 
FROM modul m 
JOIN modul_semester ms ON m.id = ms.modul 
GROUP BY m.bezeichnung;</code>

<h4><b>Manual Evaluation: 2 / 3</b></h4>
<h5>Sample Solution:</h5>
<img src="img/scenario-1-2-sample.png"/>
<h5>Student Reponse:</h5>
<img src="img/scenario-1-2-student.png"/>
<h5>Evaluation:</h5>
Points = 2

<h4><b>Distance-Based Evaluation: 2,6 / 3</b></h4>
<h5>Sample Solution:</h5>
Difficulty: 14
<h5>Student Reponse:</h5>
<strong>Total Distance: 2</strong>


SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY bezeichnung;

&gt;&gt;&gt; <strong>Cost 2</strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);

<h5>Evaluation:</h5>
Points = (14 - 2) / 14 * 3 = 2,5714285714

<h4><b>Result-Based Evaluation: 1 / 3</b></h4>
<h5>Sample Solution:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Maximum<br />Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>26</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>
<h5>Student Reponse:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>23</td>
            <td>0</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\"],<br />\"dependentAtt.\":<br />[\"semester\"]}",<br />"{\"determinateAtt.\":<br />[\"bezeichnung\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>0<br /></td>
        </tr>
    </tbody>
</table>
<h5>Evaluation:</h5>
Points = 0 + 1 + 0 = 1

<h4>Fairness:</h4> Indicate how <b>fair</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally fair.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Moderate</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Comprehensibility:</h4> Indicate how <b>comprehensible</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally comprehensible.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Easy<br />to<br />comprehend</th>
    <th>Moderate</th>
    <th>Difficult<br />to<br />comprehend</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
  </tr>
</table>

### Results

The survey results for this scenario are as follows:

| ID | DATE     | Fairness Result-Based | Fairness Distance-Based | Fairness Manual | Comprehensibility Result-Based | Comprehensibility Distance-Based | Comprehensibility Manual |
| -- | -------- | --------------- | --------------------- | --------------------- | ---------------------- | --------------------- | --------------------- |
| 1   | 12.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 2   | 13.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 3   | 17.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 4   | 21.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 5   | 24.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 6   | 24.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 7   | 26.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 8   | 02.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 9   | 02.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 10  | 04.08.23 | 3                      | 2                     | 2                     | 2                      | 1                     | 2                     |
| 11  | 04.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 12  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 13  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 14  | 07.08.23 | 3                      | 1                     | 3                     | 1                      | 1                     | 3                     |
| 15  | 07.08.23 | 3                      | 2                     | 1                     | 3                      | 1                     | 1                     |
| 16  | 07.08.23 | \-1                    | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 17  | 07.08.23 | \-1                    | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 18  | 07.08.23 | 3                      | 1                     | 2                     | 2                      | 1                     | 1                     |
| 19  | 08.08.23 | 3                      | 1                     | 1                     | 1                      | 1                     | 1                     |
| 20  | 08.08.23 | 2                      | 2                     | 1                     | 3                      | 2                     | 1                     |
| 21  | 08.08.23 | 3                      | 2                     | 1                     | 2                      | 1                     | 1                     |
| 22  | 09.08.23 | 3                      | 2                     | 1                     | 2                      | 3                     | 1                     |
| 23  | 18.08.23 | 3                      | 1                     | 2                     | 3                      | 1                     | 2                     |
| 24  | 15.08.23 | 3                      | 1                     | 1                     | 3                      | 1                     | 1                     |
| 25  | 17.08.23 | 3                      | 1                     | 1                     | 3                      | 1                     | 1                     |
| 26  | 18.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 27  | 23.08.23 | 3                      | 1                     | 1                     | 2                      | 1                     | 1                     |
| 28  | 28.08.23 | 3                      | 2                     | 1                     | 2                      | 1                     | 1                     |
| 29  | 29.08.23 | \-1                    | \-1                   | \-1                   | \-1                    | \-1                   | \-1                   |
| 30  | 29.08.23 | 2                      | 2                     | 1                     | 2                      | 2                     | 1                     |
| 31  | 31.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 32  | 01.09.23 | 2                      | 1                     | 1                     | 2                      | 1                     | 2                     |
| 33  | 01.09.23 | 2                      | 1                     | 1                     | 2                      | 2                     | 1                     |
| 34  | 01.09.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 35  | 04.09.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |

#### Legend:
- "1" represents the selection of the best option
- "0" indicates the selection of the moderate option
- "-1" signifies the selection of the worst option
- "-2" denotes no selection made by participants

## Page 5 

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Szenario 1-3</h3>
<h4>Aufgabenstellung 1</h4>
Diese Datenbank ist an den Musterstudienplan im Informatik Bachelorstudiengang angelehnt. Sie ist auf dem Stand von Wintersemester 2019/20 und besteht aus vier Relationen:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Geben Sie für jedes Modul die Bezeichnung des Moduls, das dazugehörige Semester und ECTS aus.

Die Maximale Punktzahl beträgt 3.
<h4>Musterlösung</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Studentische Antwort 3</h4>
<code>SELECT modul.bezeichnung, modul_semester.semester, modul_semester.ects 
FROM modul, modul_semester 
WHERE modul_semester.modul = modul.id 
GROUP BY modul.id, modul_semester.semester;</code>

<h4><b>Manuelle Bewertung: 2 / 3</b></h4>
<h5>Musterlösung:</h5>
<img src="img/scenario-1-3-sample.png"/>
<h5>Studentische Antwort:</h5>
<img src="img/scenario-1-3-student.png"/>
<h5>Bewertung:</h5>
Punkte = 2

<h4><b>Distanzbasierte Bewertung: 2,1 / 3</b></h4>
<h5>Musterlösung:</h5>
Difficulty: 14
<h5>Studentische Antwort:</h5>
<strong>Total Distance: 4</strong>


SELECT bezeichnung, semester, ects FROM modul, modul_semester WHERE (modul = id) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 0</strong>: Move expression from the where-clause to the join-condition of an INNER JOIN.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (modul = id) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 0</strong>: Swap arguments of commutative binary-expression in a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 2</strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY semester;

&gt;&gt;&gt; <strong>Cost 2 </strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);

<h5>Bewertung:</h5>
Punkte = (14 - 4) / 14 * 3 = 2,1428571428

<h4><b>Ergebnisbasierte Bewertung: 3 / 3</b></h4>
<h5>Musterlösung:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Maximale<br />Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>26<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>

<h5>Studentische Antwort:</h5>
<table>
    <thead>
        <tr>
            <th>Bepunktungsmetrik<br /></th>
            <th>Erwarteter Wert<br /></th>
            <th>Punkte<br /></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anzahl der Tupel<br /></td>
            <td>26<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Namen der<br />Attribute<br /></td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Funktionale<br />Abhängigkeiten<br /></td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>

<h5>Bewertung:</h5>
Punkte = 1 + 1 + 1 = 3

<h4>Fairness:</h4> Geben Sie an, wie <b>fair</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Mittel</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Nachvollziehbarkeit:</h4> Geben Sie an, wie <b>nachvollziehbar</b> ​Sie die jeweilige Bewertung finden
<br /><br />
<b>Achtung:</b> Die Bewertungen hier befinden sich möglicherweise in einer andereren Reihenfolge als weiter oben auf der Seite!
<b>Hinweis:</b> Es ist möglich, mehrere Bewertungen gleich einzustufen.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Gut<br />nachvoll-<br />ziehbar</th>
    <th>Mittel</th>
    <th>Schlecht<br />nachvoll-<br />ziehbar</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Ergebnisbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distanzbasierte<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manuelle<br />Bewertung</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
    <td width="50%">
<h3>Scenario 1-3</h3>
<h4>Task 1</h4>
This database is modeled after the standard curriculum of the Bachelor's program in Computer Science. It reflects the status as of the winter semester 2019/20 and comprises four relations:
<br /><br />
<ol><li>themengebiet ( _id_, bezeichnung )</li>
<li>modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )</li>
<li>semester ( _nummer_ )</li>
<li>modul_semester ( _modul [modul], semester [semester]_, ects )</li></ol>

Provide the name of each module, the corresponding semester, and ECTS credits.

The maximum score is 3.
<h4>Sample Solution</h4>
<code>SELECT m.bezeichnung, ms.semester, ms.ects
FROM modul m
JOIN modul_semester ms ON m.id = ms.modul;</code>
<h4>Student Response 3</h4>
<code>SELECT modul.bezeichnung, modul_semester.semester, modul_semester.ects 
FROM modul, modul_semester 
WHERE modul_semester.modul = modul.id 
GROUP BY modul.id, modul_semester.semester;</code>

<h4><b>Manual Evaluation: 2 / 3</b></h4>
<h5>Sample Solution:</h5>
<img src="img/scenario-1-3-sample.png"/>
<h5>Student Reponse:</h5>
<img src="img/scenario-1-3-student.png"/>
<h5>Evaluation:</h5>
Points = 2

<h4><b>Distance-Based Evaluation: 2,1 / 3</b></h4>
<h5>Sample Solution:</h5>
Difficulty: 14
<h5>Student Reponse:</h5>
<strong>Total Distance: 4</strong>


SELECT bezeichnung, semester, ects FROM modul, modul_semester WHERE (modul = id) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 0</strong>: Move expression from the where-clause to the join-condition of an INNER JOIN.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (modul = id) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 0</strong>: Swap arguments of commutative binary-expression in a from-element join-condition.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY id, semester;

&gt;&gt;&gt; <strong>Cost 2</strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul) GROUP BY semester;

&gt;&gt;&gt; <strong>Cost 2 </strong>: Remove (excess) element in group-by-clause.

SELECT bezeichnung, semester, ects FROM modul INNER JOIN modul_semester ON (id = modul);

<h5>Evaluation:</h5>
Points = (14 - 4) / 14 * 3 = 2,1428571428

<h4><b>Result-Based Evaluation: 3 / 3</b></h4>
<h5>Sample Solution:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Maximum<br />Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>26</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>
<h5>Student Reponse:</h5>
<table>
    <thead>
        <tr>
            <th>Scoring Metric</th>
            <th>Expected Value</th>
            <th>Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Number of Tuples</td>
            <td>26</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Attribute Names</td>
            <td>["bezeichnung",<br />"semester",<br />"ects"]<br /></td>
            <td>1<br /></td>
        </tr>
        <tr>
            <td>Functional<br />Dependencies</td>
            <td>["{\"determinateAtt.\":<br />[\"bezeichnung\",<br />\"semester\"],<br />\"dependentAtt.\":<br />[\"ects\"]}"]</td>
            <td>1<br /></td>
        </tr>
    </tbody>
</table>
<h5>Evaluation:</h5>
Points = 1 + 1 + 1 = 3

<h4>Fairness:</h4> Indicate how <b>fair</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally fair.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Fair</th>
    <th>Moderate</th>
    <th>Unfair</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>

<h4>Comprehensibility:</h4> Indicate how <b>comprehensible</b> you find each evaluation.
<br /><br />
<b>Attention:</b> The evaluations here may be in a different order than those found earlier on the page.<br />
<b>Note:</b> It is possible to rate multiple evaluations as being equally comprehensible.
<br /><br />
<table>
<thead>
  <tr>
    <th></th>
    <th>Easy<br />to<br />comprehend</th>
    <th>Moderate</th>
    <th>Difficult<br />to<br />comprehend</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Result-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Distance-Based<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
  <tr>
    <td>Manual<br />Evaluation</td>
    <td>o</td>
    <td>o</td>
    <td>o</td>
  </tr>
</tbody>
</table>
    </td>
  </tr>
</table>

### Results

The survey results for this scenario are as follows:

| ID | DATE     | Fairness Result-Based | Fairness Distance-Based | Fairness Manual | Comprehensibility Result-Based | Comprehensibility Distance-Based | Comprehensibility Manual |
| -- | -------- | --------------- | --------------------- | --------------------- | ---------------------- | --------------------- | --------------------- |
| 1   | 12.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 2   | 13.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 3   | 17.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 4   | 21.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 5   | 24.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 6   | 24.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 7   | 26.07.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 8   | 02.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 9   | 02.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 10  | 04.08.23 | 2                      | 2                     | 2                     | 1                      | 2                     | 1                     |
| 11  | 04.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 12  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 13  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 14  | 07.08.23 | 1                      | 2                     | 1                     | 1                      | 2                     | 1                     |
| 15  | 07.08.23 | 3                      | 1                     | 1                     | 2                      | 1                     | 1                     |
| 16  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 17  | 07.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 18  | 07.08.23 | 1                      | 2                     | 2                     | 1                      | 3                     | 1                     |
| 19  | 08.08.23 | 2                      | 1                     | 1                     | 1                      | 1                     | 1                     |
| 20  | 08.08.23 | 3                      | 2                     | 2                     | 3                      | 1                     | 1                     |
| 21  | 08.08.23 | 2                      | 1                     | 1                     | 3                      | 1                     | 1                     |
| 22  | 09.08.23 | 3                      | 1                     | 1                     | 3                      | 2                     | 1                     |
| 23  | 18.08.23 | 1                      | 1                     | 2                     | 3                      | 1                     | 2                     |
| 24  | 15.08.23 | 2                      | 1                     | 1                     | 2                      | 1                     | 1                     |
| 25  | 17.08.23 | 3                      | 1                     | 1                     | 3                      | 1                     | 1                     |
| 26  | 18.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 27  | 23.08.23 | 3                      | 1                     | 1                     | 2                      | 1                     | 1                     |
| 28  | 28.08.23 | 2                      | 2                     | 2                     | 1                      | 1                     | 1                     |
| 29  | 29.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 30  | 29.08.23 | 1                      | 1                     | 1                     | 1                      | 2                     | 1                     |
| 31  | 31.08.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 32  | 01.09.23 | 3                      | 1                     | 1                     | 3                      | 1                     | 1                     |
| 33  | 01.09.23 | 2                      | 1                     | 1                     | 2                      | 2                     | 1                     |
| 34  | 01.09.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |
| 35  | 04.09.23 | \-2                    | \-2                   | \-2                   | \-2                    | \-2                   | \-2                   |

#### Legend:
- "1" represents the selection of the best option
- "0" indicates the selection of the moderate option
- "-1" signifies the selection of the worst option
- "-2" denotes no selection made by participants


## Placeholder

<table>
  <tr>
    <th width="50%">German (original)</th>
    <th width="50%">English (translated)</th>
  </tr>
  <tr>
    <td width="50%">
<h3>Vergleich von SQL Bewertungs-Verfahren</h3>
    </td>
    <td width="50%">
<h3>Comparison of SQL Evaluation Methods</h3>
    </td>
  </tr>
</table>

