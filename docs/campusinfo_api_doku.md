# ZHAW CampusInfo Server

 Andreas Ahlenstorf [ahle@zhaw.ch](mailto:ahle@zhaw.ch) 

Table of Contents

[TOC]



## Allgemeines

### Eigenschaften

Das API des CampusInfo Server basiert auf HTTP und ist [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer). Dies bedeutet unter anderem:

- Das API ist nach Ressourcen, nicht nach Methoden organisiert. Um eine  Liste aller Schulklassen zu erhalten, für die ein Stundenplan verfügbar  ist, wird der URL `/schedules/classes/` benötigt, nicht eine Methode wie `GetSchoolClassSchedules()`.
- Unterschiedliche Request-Methoden auf dieselbe Ressource haben unterschiedliche Auswirkungen. Mit `GET` kann die Ressource abgerufen und mit `PUT` aktualisiert werden. In der Referenz ist jeweils angegeben, welche Request-Methoden unterstützt werden.
- **Der Request Header und seine Inhalte sind signifikant**. Durch richtiges Setzen des `Accept`-Header kann die Antwort beispielsweise als [XML](http://en.wikipedia.org/wiki/XML) oder [JSON](http://en.wikipedia.org/wiki/JSON) abgerufen werden.

### Konventionen

#### Parameter

Einige Resource-URLs unterstützen bis zu zwei verschiedene Arten von Parametern:

- url-path

   Sie sind Teil der Pfadangabe und nicht optional. In `/foo/{bar}` ist `{bar}` der Parameter. 

- searchpath

   Werden der Pfadangabe hinter einem Fragezeichen (`?`) angehängt und sind in der Regel optional. In `foo?bar=baz` ist `bar` der Parameter und `baz` sein Wert. 

#### Codierung

Manche Ressourcen unterstützen die Angabe von Parametern. Diese sollten:

- in UTF-8 codiert sein
- codiert für die Verwendung in URLs sein (siehe [Percent encoding](http://en.wikipedia.org/wiki/Percent_encoding))

Alle Antworten sind in UTF-8 codiert.

### Versionierung

Das API ist versioniert. Die aktuelle Version wird durch eine Versionsangabe wie `/v1/` zu Beginn der Resource URLs gekennzeichnet.

### Zugriff

#### Adresse

Der CampusInfo Server ist aus dem öffentlichen Netz über den URL <https://api.apps.engineering.zhaw.ch/> erreichbar.

|      | Ein Test-/Entwicklungsserver ist unter <https://beta.apps.engineering.zhaw.ch/>  erreichbar, der zur Erprobung neuer Software- respektive API-Versionen  dient. Er braucht nur verwendet zu werden, falls der "offizielle"  CampusInfo-Server die gewünschte Schnittstelle noch nicht bereitstellt.  Die Entwicklung von API-Clients kann ansonsten problemlos mit dem  offiziellen CampusInfo-Server erfolgen. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

#### Authentifizierung

Grundsätzlich kann auf alle Ressourcen *ohne Authentifizierung*  zugegriffen werden, um auch Personen, die nicht Mitglied der ZHAW sind,  den Zugriff auf die Informationen ermöglichen. Sensible Informationen,  die allenfalls *zusätzlich* verfügbar gemacht werden, können erst *nach einer erfolgreichen Authentifizierung*  abgerufen werden. Ob zusätzliche Informationen verfügbar sind bzw. eine  Authentifzierung nötig ist, ist in der API-Dokumentation der Ressourcen  vermerkt.

Es muss aber in jede Anfrage ein User-Agent Header nach dem folgenden Format eingefügt werden:

```text
User-Agent: MeineAnwendung (Kontakt)
```

Dabei kann für `Kontakt` entweder ein URL (z.B. `http://example.com`) oder eine E-Mailadresse (z.B. `somebody@example.com`)  hinterlegt werden. Diese Informationen werden nicht veröffentlicht und  dienen einzig dazu, zu verfolgen, wer auf den Service zugreift und  Kontakt aufnehmen zu können, falls irgendetwas mit den Zugriffen nicht  in Ordnung ist.

|      | Ist der User-Agent Header nicht vorhanden oder nicht im obigen Format, wird die Anfrage mit `400 Bad Request` beantwortet. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

#### Verschlüsselung

Der Zugriff auf den CampusInfo Server kann ausschliesslich  verschlüsselt über eine TLS-Verbindung erfolgen, damit einerseits der  Datenverkehr nicht abgehört und andererseits nicht manipuliert oder von  einem unberechtigten Dritten bereitgestellt werden kann. Sowohl der  offizielle CampusInfo-Server als auch die Testinstanz verfügen über  CA-signierte TLS-Zertifikate, die auf die ZHAW ausgestellt sind.

#### Kompression

Das API des CampusInfo Server unterstützt die Kompression des  Datenverkehrs, was erheblich Datenverkehr einspart und die  Übertragungszeiten verringert. Es wird deshalb sehr empfohlen,  Kompression zu verwenden.

Um komprimierte Antworten zu erhalten, muss in der Anfrage der Header `Accept-Encoding: gzip, deflate` (oder ähnlich, siehe <http://tools.ietf.org/html/rfc2616#section-14.3>) enthalten sein.

|      | Ob der Server die Antwort komprimiert hat, lässt sich am Antwort-Header `Content-Encoding` ablesen. Lautet dieser `Content-Encoding: gzip` (bzw. `deflate` oder `compress` anstatt `gzip`), so wurde die Antwort komprimiert. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

### Caching

#### Serverseitig

Die meisten vom CampusInfo-Server ausgelieferten Daten werden  serverseitig für eine gewisse Zeit zwischengespeichert. Änderungen in  Stammdatenbanken sind deshalb meist erst mit einer gewissen Verzögerung  sichtbar.

#### Client-seitig

Sind Ressourcen zur Client-seitigen Zwischenspeicherung geeignet, ist  dies samt Angabe des verwendeten Mechanismus (wie ETags oder  Last-Modified Header) in der Ressourcen-Dokumentation vermerkt.

##### ETags

Bei der Verwendung von ETags wird mit jeder Server-Antwort ein [ETag](http://tools.ietf.org/html/rfc2616#section-14.19)  mitgeliefert, der die Version der Antwort eindeutig identifiziert und  zur Bildung eines Conditional Request verwendet werden kann. Mit einem  Conditional Request wird der Server angewiesen, nur dann eine  vollständige Antwort inklusive der Daten zu liefern, falls eine neuere  Version der Ressource vorliegt. Andernfalls ist die Antwort leer. Die  Hauptvorteile sind:

- Bandbreitenersparnis
- Auf dem Client brauchen z.B. bei einer Synchronisation die lokalen  mit den vom Server gesendeten Daten nicht erst auf Unterschiede hin  untersucht werden, da man bereits durch die Server-Antwort weiss, ob  sich die Daten geändert haben oder nicht.

Die Funktionsweise ist [im Beispiel weiter unten](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#example-caching-client-etags)  illustriert. Abhängig von der verwendeten HTTP-Bibliothek muss man sich  selber um die Verarbeitung der ETags und die Erstellung der Conditional  Requests kümmern, sofern dies nicht automatisch für einen erledigt  wird.

|      | Die Java-Bibliothek [okhttp](http://square.github.io/okhttp/)  kümmert sich automatisch um die Verarbeitung von ETags und die  Erstellung von Conditional Requests, wobei das für den Anwender  transparent ist. Hat sich z.B. die Ressource auf dem Server nicht  geändert, erhält man die ursprüngliche Antwort aus einem lokalen Cache. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

Example 1. Conditional Requests mit ETags

Erster Request:

```http
GET /v1/catering/facilities HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Der Antwort-Header (gekürzt) erhält neu den ETag `1LFuo7Gm4hUWxHbSpnHCBA==`, der die Version der gelieferten Antwort (nicht gezeigt) eindeutig identifiziert.

```http
HTTP/1.1 200 OK
Content-Length: 5724
Cache-Control: private
Content-Type: application/json; charset=utf-8
Etag: "1LFuo7Gm4hUWxHbSpnHCBA=="
Connection: close
```

Für einen Conditional Request muss nun der ETag zusammen mit dem Header `If-None-Match` in den Request eingebettet werden:

```http
GET /v1/catering/facilities HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
If-None-Match: "1LFuo7Gm4hUWxHbSpnHCBA=="
```

Hat sich die Ressource seit dem ersten Request nicht geändert, antwortet der Server mit `HTTP/1.1 304 Not Modified`, wobei die Payload (also das angeforderte JSON-Dokument) weggelassen (Header `Content-Length` fehlt) und derselbe ETag mitgesendet wird:

```http
HTTP/1.1 304 Not Modified
Cache-Control: private
Etag: "1LFuo7Gm4hUWxHbSpnHCBA=="
Connection: close
```

Hat sich die Ressource dagegen seit dem ersten Request geändert, antwortet der Server regulär mit `HTTP/1.1 200 OK`, wobei die Payload (das angeforderte JSON-Dokument, nicht gezeigt) ebenso wie der neue ETag `yzx3Da4mwyTfH+PLZ9mz2w==` mitgesendet werden:

```http
HTTP/1.1 200 OK
Content-Length: 4129
Cache-Control: private
Content-Type: application/json; charset=utf-8
Etag: "yzx3Da4mwyTfH+PLZ9mz2w=="
Connection: close
```

### Entwicklung

#### SDK

Ein formelles SDK steht im Moment nicht zur Verfügung. Auf Anfrage  sind aber die verwendeten Data Transfer Objects in C# (für XMLSerializer  bzw. Json.NET) und Java (für Jackson) erhältlich.

#### Ausprobieren/Debugging des REST API

HTTP Clients helfen beim Ausprobieren des REST API. Populäre Varianten:

- [curl](http://curl.haxx.se): Kommandozeilen-Werkzeug für Linux, Mac OS X etc.
- [Fiddler](http://fiddler2.com): HTTP-Client/Proxy mit grafischer Benutzeroberfläche für Windows.
- [HTTP Client](http://ditchnet.org/httpclient/): HTTP-Client mit grafischer Benutzeroberfläche für Mac OS X.

Möchte man den eigentlichen Datenverkehr zwischen Gerät und Server  anschauen, reicht aufgrund des verschlüsselten Datenverkehrs ein  einfaches Mithören, beispielsweise mit Wireshark, nicht aus. Statt  dessen braucht man einen Intercepting Proxy, der zwischen Gerät und  Server sitzt und für das Gerät als Server bzw. für den Server als Gerät  agiert. Auf diese Weise kann beim Intercepting Proxy der Klartext  ausgelesen werden. Zwei einfache Varianten, einen Intercepting Proxy zu  realisieren, sind:

- [Fiddler](http://fiddler2.com) (Windows, [Dokumentation für SSL-Entschlüsselung](http://fiddler2.com/documentation/Configure-Fiddler/Tasks/DecryptHTTPS))
- [OWASP Zed Attack Proxy](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project) (plattformunabhängig, [Dokumentation für SSL-Entschlüsselung](http://code.google.com/p/zaproxy/wiki/HelpUiDialogsOptionsDynsslcert)).

## Stundenplan-Ressourcen

### GET /v1/schedules/classes/

Liefert einen Index mit den Schulklassen, für die Stundenpläne  vorhanden sind. Sind keine Schulklassen vorhanden, wird ein leerer Index  zurückgegeben.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/classes/` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 2. Klassen-Index in JSON

Request:

```http
GET /v1/schedules/classes/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort (gekürzt):

```json
{
    "classes": [
        "AL09",
        "AL10",
        "AL12",
        "ARB07",
        "ARB08",
        "ARB09",
        "ARB10",
        "ARB11",
        "ARB12",
        "VS11a",
        "VS11t",
        "VUHKS",
        "VUKHS",
        "WI09a",
        "WI09b",
        "WI09t",
        "WI10a",
        "WI10b",
        "WI10t",
        "WI11a",
        "WI11b",
        "WI11c",
        "WI11t",
        "ZLG"
    ]
}
```

Example 3. Klassen-Index in XML

Request:

```http
GET /v1/schedules/classes/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort (gekürzt):

```xml
<index>
  <classes>
	<class>AL09</class>
	<class>AL10</class>
	<class>AL12</class>
	<class>ARB07</class>
	<class>ARB08</class>
	<class>ARB09</class>
	<class>ARB10</class>
	<!-- ... -->
	<class>WI09a</class>
	<class>WI09b</class>
	<class>WI09t</class>
	<class>WI10a</class>
	<class>WI10b</class>
	<class>WI10t</class>
	<class>WI11a</class>
	<class>WI11b</class>
	<class>WI11c</class>
	<class>WI11t</class>
	<class>ZLG</class>
  </classes>
</index>
```

### GET /v1/schedules/classes/{name}

Retourniert den Stundenplan der Klasse mit dem Namen `name`.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/classes/{name}?startingAt={date}&days={number}` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                  | Beschreibung                                                 |
| ------------------------------------- | ------------------------------------------------------------ |
| **days** *searchpart, optional*       | Anzahl  Tage, die der Stundenplan umfassen soll. Es werden Werte aus dem  Intervall [1,7] akzeptiert. Wird die Anzahl Tage nicht angegeben, werden  standardmässig 7 Tage angezeigt. **Beispiel-Wert**: `6` |
| **name** *url-path, vorgeschrieben*   | Name der Klasse, deren Stundenplan abgerufen werden soll. **Beispiel-Wert**: `T_AV10a.BA` |
| **startingAt** *searchpart, optional* | Datum,  mit dem der Stundenplan beginnen soll, in der Form JJJJ-MM-TT. Wird  kein Datum angegeben, wird das aktuelle Datum verwendet. **Beispiel-Wert**: `2012-05-18` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Werte für  übergebene Parameter sind illegal. Beispiel: Stundenplan soll mehr als 7  Tage lang sein. 

- `404 Not Found`

   Stundenplan kann nicht gefunden werden (Klasse unbekannt, kein Stundenplan für das gewählte Datum…) 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 4. Tagesstundenplan einer Klasse in JSON

Request:

```http
GET /v1/schedules/classes/T_AV10a.BA?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
   "type":"Class",
   "days":[
      {
         "date":"2012-05-14T00:00:00",
         "events":[
            {
               "description":"",
               "endTime":"2012-05-14T09:35:00",
               "name":"t.TEMS-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TL 201"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Hanfried",
                           "lastName":"Hesselbarth",
                           "shortName":"hsbh"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T08:45:00",
                     "startTime":"2012-05-14T08:00:00"
                  },
                  {
                     "endTime":"2012-05-14T09:35:00",
                     "startTime":"2012-05-14T08:50:00"
                  }
               ],
               "startTime":"2012-05-14T08:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"Navigation - Vorlesung",
               "endTime":"2012-05-14T11:35:00",
               "name":"t.NAV-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TE 319"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Heinz",
                           "lastName":"Wipf",
                           "shortName":"wipf"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T08:45:00",
                     "startTime":"2012-05-14T08:00:00"
                  },
                  {
                     "endTime":"2012-05-14T09:35:00",
                     "startTime":"2012-05-14T08:50:00"
                  },
                  {
                     "endTime":"2012-05-14T10:45:00",
                     "startTime":"2012-05-14T10:00:00"
                  },
                  {
                     "endTime":"2012-05-14T11:35:00",
                     "startTime":"2012-05-14T10:50:00"
                  }
               ],
               "startTime":"2012-05-14T08:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"",
               "endTime":"2012-05-14T11:35:00",
               "name":"t.TEMS-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TL 201"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Hanfried",
                           "lastName":"Hesselbarth",
                           "shortName":"hsbh"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T10:45:00",
                     "startTime":"2012-05-14T10:00:00"
                  },
                  {
                     "endTime":"2012-05-14T11:35:00",
                     "startTime":"2012-05-14T10:50:00"
                  }
               ],
               "startTime":"2012-05-14T10:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"",
               "endTime":"2012-05-14T13:35:00",
               "name":"t.MEMI-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TE 402"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"",
                           "lastName":"",
                           "shortName":"div"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T12:45:00",
                     "startTime":"2012-05-14T12:00:00"
                  },
                  {
                     "endTime":"2012-05-14T13:35:00",
                     "startTime":"2012-05-14T12:50:00"
                  }
               ],
               "startTime":"2012-05-14T12:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"",
               "endTime":"2012-05-14T15:35:00",
               "name":"t.GNTS-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 414"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Martin",
                           "lastName":"Schlup",
                           "shortName":"spma"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T14:45:00",
                     "startTime":"2012-05-14T14:00:00"
                  },
                  {
                     "endTime":"2012-05-14T15:35:00",
                     "startTime":"2012-05-14T14:50:00"
                  }
               ],
               "startTime":"2012-05-14T14:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"Air Traffic Management 1- Vorlesung",
               "endTime":"2012-05-14T17:35:00",
               "name":"t.ATM1-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TL 201"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Peter",
                           "lastName":"Tiegel",
                           "shortName":"ti1"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T14:45:00",
                     "startTime":"2012-05-14T14:00:00"
                  },
                  {
                     "endTime":"2012-05-14T15:35:00",
                     "startTime":"2012-05-14T14:50:00"
                  },
                  {
                     "endTime":"2012-05-14T16:45:00",
                     "startTime":"2012-05-14T16:00:00"
                  },
                  {
                     "endTime":"2012-05-14T17:35:00",
                     "startTime":"2012-05-14T16:50:00"
                  }
               ],
               "startTime":"2012-05-14T14:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"",
               "endTime":"2012-05-14T17:35:00",
               "name":"t.GNTS-P",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 414"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Martin",
                           "lastName":"Schlup",
                           "shortName":"spma"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV10a.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T16:45:00",
                     "startTime":"2012-05-14T16:00:00"
                  },
                  {
                     "endTime":"2012-05-14T17:35:00",
                     "startTime":"2012-05-14T16:50:00"
                  }
               ],
               "startTime":"2012-05-14T16:00:00",
               "type":"CourseEvent"
            }
         ],
         "slots":[
            {
               "endTime":"2012-05-14T08:45:00",
               "startTime":"2012-05-14T08:00:00"
            },
            {
               "endTime":"2012-05-14T09:35:00",
               "startTime":"2012-05-14T08:50:00"
            },
            {
               "endTime":"2012-05-14T10:45:00",
               "startTime":"2012-05-14T10:00:00"
            },
            {
               "endTime":"2012-05-14T11:35:00",
               "startTime":"2012-05-14T10:50:00"
            },
            {
               "endTime":"2012-05-14T12:45:00",
               "startTime":"2012-05-14T12:00:00"
            },
            {
               "endTime":"2012-05-14T13:35:00",
               "startTime":"2012-05-14T12:50:00"
            },
            {
               "endTime":"2012-05-14T14:45:00",
               "startTime":"2012-05-14T14:00:00"
            },
            {
               "endTime":"2012-05-14T15:35:00",
               "startTime":"2012-05-14T14:50:00"
            },
            {
               "endTime":"2012-05-14T16:45:00",
               "startTime":"2012-05-14T16:00:00"
            },
            {
               "endTime":"2012-05-14T17:35:00",
               "startTime":"2012-05-14T16:50:00"
            },
            {
               "endTime":"2012-05-14T18:45:00",
               "startTime":"2012-05-14T18:00:00"
            },
            {
               "endTime":"2012-05-14T19:35:00",
               "startTime":"2012-05-14T18:50:00"
            },
            {
               "endTime":"2012-05-14T20:30:00",
               "startTime":"2012-05-14T19:45:00"
            },
            {
               "endTime":"2012-05-14T21:20:00",
               "startTime":"2012-05-14T20:35:00"
            }
         ]
      }
   ],
   "course":null,
   "lecturer":null,
   "room":null,
   "class":{
      "name":"T_AV10a.BA"
   },
   "student":null
}
```

Example 5. Tagesstundenplan einer Klasse in XML

Request:

```http
GET /v1/schedules/classes/T_AV10a.BA?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schedule xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<type>Class</type>
<days>
    <day>
        <date>2012-05-14T00:00:00</date>
        <events>
            <event>
                <description/>
                <endTime>2012-05-14T09:35:00</endTime>
                <name>t.TEMS-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TL 201</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Hanfried</firstName>
                                <lastName>Hesselbarth</lastName>
                                <shortName>hsbh</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T08:45:00</endTime>
                        <startTime>2012-05-14T08:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T09:35:00</endTime>
                        <startTime>2012-05-14T08:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T08:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description>Navigation - Vorlesung</description>
                <endTime>2012-05-14T11:35:00</endTime>
                <name>t.NAV-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TE 319</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Heinz</firstName>
                                <lastName>Wipf</lastName>
                                <shortName>wipf</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T08:45:00</endTime>
                        <startTime>2012-05-14T08:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T09:35:00</endTime>
                        <startTime>2012-05-14T08:50:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T10:45:00</endTime>
                        <startTime>2012-05-14T10:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T11:35:00</endTime>
                        <startTime>2012-05-14T10:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T08:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description/>
                <endTime>2012-05-14T11:35:00</endTime>
                <name>t.TEMS-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TL 201</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Hanfried</firstName>
                                <lastName>Hesselbarth</lastName>
                                <shortName>hsbh</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T10:45:00</endTime>
                        <startTime>2012-05-14T10:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T11:35:00</endTime>
                        <startTime>2012-05-14T10:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T10:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description/>
                <endTime>2012-05-14T13:35:00</endTime>
                <name>t.MEMI-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TE 402</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName/>
                                <lastName/>
                                <shortName>div</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T12:45:00</endTime>
                        <startTime>2012-05-14T12:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T13:35:00</endTime>
                        <startTime>2012-05-14T12:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T12:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description/>
                <endTime>2012-05-14T15:35:00</endTime>
                <name>t.GNTS-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 414</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Martin</firstName>
                                <lastName>Schlup</lastName>
                                <shortName>spma</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T14:45:00</endTime>
                        <startTime>2012-05-14T14:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T15:35:00</endTime>
                        <startTime>2012-05-14T14:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T14:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description>Air Traffic Management 1- Vorlesung</description>
                <endTime>2012-05-14T17:35:00</endTime>
                <name>t.ATM1-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TL 201</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Peter</firstName>
                                <lastName>Tiegel</lastName>
                                <shortName>ti1</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T14:45:00</endTime>
                        <startTime>2012-05-14T14:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T15:35:00</endTime>
                        <startTime>2012-05-14T14:50:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T16:45:00</endTime>
                        <startTime>2012-05-14T16:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T17:35:00</endTime>
                        <startTime>2012-05-14T16:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T14:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description/>
                <endTime>2012-05-14T17:35:00</endTime>
                <name>t.GNTS-P</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 414</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Martin</firstName>
                                <lastName>Schlup</lastName>
                                <shortName>spma</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV10a.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T16:45:00</endTime>
                        <startTime>2012-05-14T16:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T17:35:00</endTime>
                        <startTime>2012-05-14T16:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T16:00:00</startTime>
                <type>CourseEvent</type>
            </event>
        </events>
        <slots>
            <slot>
                <endTime>2012-05-14T08:45:00</endTime>
                <startTime>2012-05-14T08:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T09:35:00</endTime>
                <startTime>2012-05-14T08:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T10:45:00</endTime>
                <startTime>2012-05-14T10:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T11:35:00</endTime>
                <startTime>2012-05-14T10:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T12:45:00</endTime>
                <startTime>2012-05-14T12:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T13:35:00</endTime>
                <startTime>2012-05-14T12:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T14:45:00</endTime>
                <startTime>2012-05-14T14:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T15:35:00</endTime>
                <startTime>2012-05-14T14:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T16:45:00</endTime>
                <startTime>2012-05-14T16:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T17:35:00</endTime>
                <startTime>2012-05-14T16:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T18:45:00</endTime>
                <startTime>2012-05-14T18:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T19:35:00</endTime>
                <startTime>2012-05-14T18:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T20:30:00</endTime>
                <startTime>2012-05-14T19:45:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T21:20:00</endTime>
                <startTime>2012-05-14T20:35:00</startTime>
            </slot>
        </slots>
    </day>
</days>
<class>
    <name>T_AV10a.BA</name>
</class>
</schedule>
```

### GET /v1/schedules/courses/

Liefert einen Index mit den Kursen, für die Stundenpläne vorhanden sind. Sind keine Kurse verzeichnet, ist der Index leer.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/courses/` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 6. Kurs-Index in JSON

Request:

```http
GET /v1/schedules/classes/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort (gekürzt):

```json
{
    "courses": [
        {
            "description": "a.BPM1",
            "name": "a.bpm1"
        },
        {
            "description": "a.BPM3",
            "name": "a.bpm3"
        },
        {
            "description": "a.BR1",
            "name": "a.br1"
        },
        {
            "description": "a.BR3",
            "name": "a.br3"
        },
        {
            "description": "a.BTAR1",
            "name": "a.btar1"
        },
        {
            "description": "a.BTAR3",
            "name": "a.btar3"
        },
        {
            "description": "a.E+K1",
            "name": "a.e+k1"
        },
        {
            "description": "Architekturgeschichte 1",
            "name": "w-z1"
        }
    ]
}
```

Example 7. Kurs-Index in XML

Request:

```http
GET /v1/schedules/classes/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort (gekürzt):

```xml
<?xml version="1.0"?>
<index xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <courses>
	<course>
	  <name>a.bpm3</name>
	  <description>a.BPM3</description>
	</course>
	<course>
	  <name>a.br1</name>
	  <description>a.BR1</description>
	</course>
	<course>
	  <name>a.br3</name>
	  <description>a.BR3</description>
	</course>
	<!-- ... -->
	<course>
	  <name>w-x2</name>
	  <description/>
	</course>
	<course>
	  <name>w-y1</name>
	  <description>Research Design Methode 1</description>
	</course>
	<course>
	  <name>w-z1</name>
	  <description>Architekturgeschichte 1</description>
	</course>
  </courses>
</index>
```

### GET /v1/schedules/courses/{name}

Retourniert den Stundenplan des Kurses mit dem Namen `name`.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/courses/{name}?startingAt={date}&days={number}` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                  | Beschreibung                                                 |
| ------------------------------------- | ------------------------------------------------------------ |
| **days** *searchpart, optional*       | Anzahl  Tage, die der Stundenplan umfassen soll. Es werden Werte aus dem  Intervall [1,7] akzeptiert. Wird die Anzahl Tage nicht angegeben, werden  standardmässig 7 Tage angezeigt. **Beispiel-Wert**: `6` |
| **name** *url-path, vorgeschrieben*   | Name des Kurses, dessen Stundenplan abgerufen werden soll. **Beispiel-Wert**: `t.SRM-G` |
| **startingAt** *searchpart, optional* | Datum,  mit dem der Stundenplan beginnen soll, in der Form JJJJ-MM-TT. Wird  kein Datum angegeben, wird das aktuelle Datum verwendet. **Beispiel-Wert**: `2012-05-18` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Werte für  übergebene Parameter sind illegal. Beispiel: Stundenplan soll mehr als 7  Tage lang sein. 

- `404 Not Found`

   Stundenplan kann nicht gefunden werden (Kurs unbekannt, kein Stundenplan für das gewählte Datum…) 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 8. Tagesstundenplan eines Kurses in JSON

Request:

```http
GET /v1/schedules/courses/t.SRM-G?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
   "type":"Course",
   "days":[
      {
         "date":"2012-05-14T00:00:00",
         "events":[
            {
               "description":"Safety- und Riskmanagement - Gruppenunterricht",
               "endTime":"2012-05-14T17:35:00",
               "name":"t.SRM-G",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 610"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Heinrich",
                           "lastName":"Kuhn",
                           "shortName":"kuhn"
                        },
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Andrea",
                           "lastName":"Muggli",
                           "shortName":"muga"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV09a.BA"
                        },
                        {
                           "name":"T_AV09b.BA"
                        },
                        {
                           "name":"T_AV09c.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T14:45:00",
                     "startTime":"2012-05-14T14:00:00"
                  },
                  {
                     "endTime":"2012-05-14T15:35:00",
                     "startTime":"2012-05-14T14:50:00"
                  },
                  {
                     "endTime":"2012-05-14T16:45:00",
                     "startTime":"2012-05-14T16:00:00"
                  },
                  {
                     "endTime":"2012-05-14T17:35:00",
                     "startTime":"2012-05-14T16:50:00"
                  }
               ],
               "startTime":"2012-05-14T14:00:00",
               "type":"CourseEvent"
            }
         ],
         "slots":[
            {
               "endTime":"2012-05-14T08:45:00",
               "startTime":"2012-05-14T08:00:00"
            },
            {
               "endTime":"2012-05-14T09:35:00",
               "startTime":"2012-05-14T08:50:00"
            },
            {
               "endTime":"2012-05-14T10:45:00",
               "startTime":"2012-05-14T10:00:00"
            },
            {
               "endTime":"2012-05-14T11:35:00",
               "startTime":"2012-05-14T10:50:00"
            },
            {
               "endTime":"2012-05-14T12:45:00",
               "startTime":"2012-05-14T12:00:00"
            },
            {
               "endTime":"2012-05-14T13:35:00",
               "startTime":"2012-05-14T12:50:00"
            },
            {
               "endTime":"2012-05-14T14:45:00",
               "startTime":"2012-05-14T14:00:00"
            },
            {
               "endTime":"2012-05-14T15:35:00",
               "startTime":"2012-05-14T14:50:00"
            },
            {
               "endTime":"2012-05-14T16:45:00",
               "startTime":"2012-05-14T16:00:00"
            },
            {
               "endTime":"2012-05-14T17:35:00",
               "startTime":"2012-05-14T16:50:00"
            },
            {
               "endTime":"2012-05-14T18:45:00",
               "startTime":"2012-05-14T18:00:00"
            },
            {
               "endTime":"2012-05-14T19:35:00",
               "startTime":"2012-05-14T18:50:00"
            },
            {
               "endTime":"2012-05-14T20:30:00",
               "startTime":"2012-05-14T19:45:00"
            },
            {
               "endTime":"2012-05-14T21:20:00",
               "startTime":"2012-05-14T20:35:00"
            }
         ]
      }
   ],
   "course":{
      "name":"t.SRM-G",
      "description":"Safety- und Riskmanagement - Gruppenunterricht"
   },
   "lecturer":null,
   "room":null,
   "class":null,
   "student":null
}
```

Example 9. Tagesstundenplan eines Kurses in XML

Request:

```http
GET /v1/schedules/courses/t.SRM-G?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schedule xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<type>Course</type>
<days>
    <day>
        <date>2012-05-14T00:00:00</date>
        <events>
            <event>
                <description>Safety- und Riskmanagement - Gruppenunterricht</description>
                <endTime>2012-05-14T17:35:00</endTime>
                <name>t.SRM-G</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 610</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Heinrich</firstName>
                                <lastName>Kuhn</lastName>
                                <shortName>kuhn</shortName>
                            </lecturer>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Andrea</firstName>
                                <lastName>Muggli</lastName>
                                <shortName>muga</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV09a.BA</name>
                            </class>
                            <class>
                                <name>T_AV09b.BA</name>
                            </class>
                            <class>
                                <name>T_AV09c.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T14:45:00</endTime>
                        <startTime>2012-05-14T14:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T15:35:00</endTime>
                        <startTime>2012-05-14T14:50:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T16:45:00</endTime>
                        <startTime>2012-05-14T16:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T17:35:00</endTime>
                        <startTime>2012-05-14T16:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T14:00:00</startTime>
                <type>CourseEvent</type>
            </event>
        </events>
        <slots>
            <slot>
                <endTime>2012-05-14T08:45:00</endTime>
                <startTime>2012-05-14T08:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T09:35:00</endTime>
                <startTime>2012-05-14T08:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T10:45:00</endTime>
                <startTime>2012-05-14T10:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T11:35:00</endTime>
                <startTime>2012-05-14T10:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T12:45:00</endTime>
                <startTime>2012-05-14T12:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T13:35:00</endTime>
                <startTime>2012-05-14T12:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T14:45:00</endTime>
                <startTime>2012-05-14T14:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T15:35:00</endTime>
                <startTime>2012-05-14T14:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T16:45:00</endTime>
                <startTime>2012-05-14T16:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T17:35:00</endTime>
                <startTime>2012-05-14T16:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T18:45:00</endTime>
                <startTime>2012-05-14T18:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T19:35:00</endTime>
                <startTime>2012-05-14T18:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T20:30:00</endTime>
                <startTime>2012-05-14T19:45:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T21:20:00</endTime>
                <startTime>2012-05-14T20:35:00</startTime>
            </slot>
        </slots>
    </day>
</days>
<course>
    <name>t.SRM-G</name>
    <description>Safety- und Riskmanagement - Gruppenunterricht</description>
</course>
</schedule>
```

### GET /v1/schedules/lecturers/

Liefert einen Index mit den Dozenten, für die Stundenpläne vorhanden sind. Sind keine Dozenten  verzeichnet, ist der Index leer.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/lecturers/` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 10. Dozenten-Index in JSON

Request:

```http
GET /v1/schedules/lecturers/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort (gekürzt):

```json
{
    "lecturers": [
        {
            "name": "Christian Abegglen",
            "shortName": "abegglen"
        },
        {
            "name": " Abegglen",
            "shortName": "abg"
        },
        {
            "name": "Francesco Accardo",
            "shortName": "acca"
        },
        {
            "name": "Christian Adlhart",
            "shortName": "adas"
        },
        {
            "name": "Josef Adam",
            "shortName": "adjo"
        },
        {
            "name": "Marc Zwicky",
            "shortName": "zwim"
        },
        {
            "name": "Markus Zwyssig",
            "shortName": "zwys"
        }
    ]
}
```

Example 11. Dozenten-Index in XML

Request:

```http
GET /v1/schedules/lecturers/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort (gekürzt):

```xml
<?xml version="1.0"?>
<index xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <lecturers>
    <lecturer>
      <name>Christian Abegglen</name>
      <shortName>abegglen</shortName>
    </lecturer>
    <lecturer>
      <name> Abegglen</name>
      <shortName>abg</shortName>
    </lecturer>
    <lecturer>
      <name>Francesco Accardo</name>
      <shortName>acca</shortName>
    </lecturer>
    <!-- ... -->
    <lecturer>
      <name>Marc Zwicky</name>
      <shortName>zwim</shortName>
    </lecturer>
    <lecturer>
      <name>Markus Zwyssig</name>
      <shortName>zwys</shortName>
    </lecturer>
  </lecturers>
</index>
```

### GET /v1/schedules/lecturers/{name}

Retourniert den Stundenplan des Dozenten mit dem Dozentenkürzel `name`.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/lecturers/{name}?startingAt={date}&days={number}` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                  | Beschreibung                                                 |
| ------------------------------------- | ------------------------------------------------------------ |
| **days** *searchpart, optional*       | Anzahl  Tage, die der Stundenplan umfassen soll. Es werden Werte aus dem  Intervall [1,7] akzeptiert. Wird die Anzahl Tage nicht angegeben, werden  standardmässig 7 Tage angezeigt. **Beispiel-Wert**: `6` |
| **name** *url-path, vorgeschrieben*   | Kürzel des Dozenten, dessen Stundenplan abgerufen werden soll. **Beispiel-Wert**: `abcd` |
| **startingAt** *searchpart, optional* | Datum,  mit dem der Stundenplan beginnen soll, in der Form JJJJ-MM-TT. Wird  kein Datum angegeben, wird das aktuelle Datum verwendet. **Beispiel-Wert**: `2012-05-18` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Werte für  übergebene Parameter sind illegal. Beispiel: Stundenplan soll mehr als 7  Tage lang sein. 

- `404 Not Found`

   Stundenplan kann nicht gefunden werden (Dozent unbekannt, kein Stundenplan für das gewählte Datum…) 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 12. Tagesstundenplan eines Dozenten in JSON

Request:

```http
GET /v1/schedules/lecturers/baug?startingAt=2012-05-15&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
   "type":"Lecturer",
   "days":[
      {
         "date":"2012-05-15T00:00:00",
         "events":[
            {
               "description":"Decision Support Systems - Vorlesung",
               "endTime":"2012-05-15T11:35:00",
               "name":"t.DSSY-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TL 418"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Gerold",
                           "lastName":"Baudinot",
                           "shortName":"baug"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_SI09a.BA"
                        },
                        {
                           "name":"T_UI09b.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-15T10:45:00",
                     "startTime":"2012-05-15T10:00:00"
                  },
                  {
                     "endTime":"2012-05-15T11:35:00",
                     "startTime":"2012-05-15T10:50:00"
                  }
               ],
               "startTime":"2012-05-15T10:00:00",
               "type":"CourseEvent"
            }
         ],
         "slots":[
            {
               "endTime":"2012-05-15T08:45:00",
               "startTime":"2012-05-15T08:00:00"
            },
            {
               "endTime":"2012-05-15T09:35:00",
               "startTime":"2012-05-15T08:50:00"
            },
            {
               "endTime":"2012-05-15T10:45:00",
               "startTime":"2012-05-15T10:00:00"
            },
            {
               "endTime":"2012-05-15T11:35:00",
               "startTime":"2012-05-15T10:50:00"
            },
            {
               "endTime":"2012-05-15T12:45:00",
               "startTime":"2012-05-15T12:00:00"
            },
            {
               "endTime":"2012-05-15T13:35:00",
               "startTime":"2012-05-15T12:50:00"
            },
            {
               "endTime":"2012-05-15T14:45:00",
               "startTime":"2012-05-15T14:00:00"
            },
            {
               "endTime":"2012-05-15T15:35:00",
               "startTime":"2012-05-15T14:50:00"
            },
            {
               "endTime":"2012-05-15T16:45:00",
               "startTime":"2012-05-15T16:00:00"
            },
            {
               "endTime":"2012-05-15T17:35:00",
               "startTime":"2012-05-15T16:50:00"
            },
            {
               "endTime":"2012-05-15T18:45:00",
               "startTime":"2012-05-15T18:00:00"
            },
            {
               "endTime":"2012-05-15T19:35:00",
               "startTime":"2012-05-15T18:50:00"
            },
            {
               "endTime":"2012-05-15T20:30:00",
               "startTime":"2012-05-15T19:45:00"
            },
            {
               "endTime":"2012-05-15T21:20:00",
               "startTime":"2012-05-15T20:35:00"
            }
         ]
      }
   ],
   "course":null,
   "lecturer":{
      "type":"Lecturer",
      "department":{
         "name":"T"
      },
      "firstName":null,
      "lastName":null,
      "shortName":"baug"
   },
   "room":null,
   "class":null,
   "student":null
}
```

Example 13. Tagesstundenplan eines Dozenten in XML

Request:

```http
GET /v1/schedules/lecturers/baug?startingAt=2012-05-15&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schedule xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<type>Lecturer</type>
<days>
    <day>
        <date>2012-05-15T00:00:00</date>
        <events>
            <event>
                <description>Decision Support Systems - Vorlesung</description>
                <endTime>2012-05-15T11:35:00</endTime>
                <name>t.DSSY-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TL 418</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Gerold</firstName>
                                <lastName>Baudinot</lastName>
                                <shortName>baug</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_SI09a.BA</name>
                            </class>
                            <class>
                                <name>T_UI09b.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-15T10:45:00</endTime>
                        <startTime>2012-05-15T10:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-15T11:35:00</endTime>
                        <startTime>2012-05-15T10:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-15T10:00:00</startTime>
                <type>CourseEvent</type>
            </event>
        </events>
        <slots>
            <slot>
                <endTime>2012-05-15T08:45:00</endTime>
                <startTime>2012-05-15T08:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T09:35:00</endTime>
                <startTime>2012-05-15T08:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T10:45:00</endTime>
                <startTime>2012-05-15T10:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T11:35:00</endTime>
                <startTime>2012-05-15T10:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T12:45:00</endTime>
                <startTime>2012-05-15T12:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T13:35:00</endTime>
                <startTime>2012-05-15T12:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T14:45:00</endTime>
                <startTime>2012-05-15T14:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T15:35:00</endTime>
                <startTime>2012-05-15T14:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T16:45:00</endTime>
                <startTime>2012-05-15T16:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T17:35:00</endTime>
                <startTime>2012-05-15T16:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T18:45:00</endTime>
                <startTime>2012-05-15T18:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T19:35:00</endTime>
                <startTime>2012-05-15T18:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T20:30:00</endTime>
                <startTime>2012-05-15T19:45:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-15T21:20:00</endTime>
                <startTime>2012-05-15T20:35:00</startTime>
            </slot>
        </slots>
    </day>
</days>
<lecturer>
    <type>Lecturer</type>
    <department>
        <name>T</name>
    </department>
    <shortName>baug</shortName>
</lecturer>
</schedule>
```

### GET /v1/schedules/rooms/

Liefert einen Index mit den Räumen, für die Stundenpläne vorhanden sind. Sind keine Räume  verzeichnet, ist der Index leer.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/rooms/` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 14. Raum-Index in JSON

Request:

```http
GET /v1/schedules/rooms/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort (gekürzt):

```json
{
    "rooms": [
        "b 156",
        "b 404",
        "tp 404",
        "tp 405",
        "tp 405/1",
        "tp 406",
        "tp 407",
        "tp 407/1",
        "tp 408",
        "tp 410"
    ]
}
```

Example 15. Raum-Index in XML

Request:

```http
GET /v1/schedules/rooms/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort (gekürzt):

```xml
<?xml version="1.0"?>
<index xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <rooms>
    <room>b 156</room>
    <room>b 404</room>
    <room>b156</room>
    <room>b404</room>
    <!-- ... -->
    <room>tp 406</room>
    <room>tp 407</room>
    <room>tp 407/1</room>
    <room>tp 408</room>
    <room>tp 410</room>
  </rooms>
</index>
```

### GET /v1/schedules/rooms/{name}

Retourniert den Stundenplan des Dozenten mit dem Dozentenkürzel `name`.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/rooms/{name}?startingAt={date}&days={number}` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                  | Beschreibung                                                 |
| ------------------------------------- | ------------------------------------------------------------ |
| **days** *searchpart, optional*       | Anzahl  Tage, die der Stundenplan umfassen soll. Es werden Werte aus dem  Intervall [1,7] akzeptiert. Wird die Anzahl Tage nicht angegeben, werden  standardmässig 7 Tage angezeigt. **Beispiel-Wert**: `6` |
| **name** *url-path, vorgeschrieben*   | Name des Raums, dessen Stundenplan abgerufen werden soll. **Beispiel-Wert**: `TB 610` |
| **startingAt** *searchpart, optional* | Datum,  mit dem der Stundenplan beginnen soll, in der Form JJJJ-MM-TT. Wird  kein Datum angegeben, wird das aktuelle Datum verwendet. **Beispiel-Wert**: `2012-05-18` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Werte für  übergebene Parameter sind illegal. Beispiel: Stundenplan soll mehr als 7  Tage lang sein. 

- `404 Not Found`

   Stundenplan kann nicht gefunden werden (Raum unbekannt, kein Stundenplan für das gewählte Datum…) 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 16. Tagesstundenplan eines Raums in JSON

Request:

```http
GET /v1/schedules/rooms/TB%20610?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
   "type":"Room",
   "days":[
      {
         "date":"2012-05-14T00:00:00",
         "events":[
            {
               "description":"Corporate Network Infrastructure Vorlesung",
               "endTime":"2012-05-14T09:35:00",
               "name":"t.CNI-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 610"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Kurt",
                           "lastName":"Hauser",
                           "shortName":"husr"
                        },
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Hans",
                           "lastName":"Weibel",
                           "shortName":"wlan"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_SI09a.BA"
                        },
                        {
                           "name":"T_UI09b.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T08:45:00",
                     "startTime":"2012-05-14T08:00:00"
                  },
                  {
                     "endTime":"2012-05-14T09:35:00",
                     "startTime":"2012-05-14T08:50:00"
                  }
               ],
               "startTime":"2012-05-14T08:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"Regelungstechnik 2 Vorlesung",
               "endTime":"2012-05-14T13:35:00",
               "name":"t.RT2-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 610"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Ruprecht",
                           "lastName":"Altenburger",
                           "shortName":"altb"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_ME09a.BA"
                        },
                        {
                           "name":"T_ME09b.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T12:45:00",
                     "startTime":"2012-05-14T12:00:00"
                  },
                  {
                     "endTime":"2012-05-14T13:35:00",
                     "startTime":"2012-05-14T12:50:00"
                  }
               ],
               "startTime":"2012-05-14T12:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"Safety- und Riskmanagement - Gruppenunterricht",
               "endTime":"2012-05-14T17:35:00",
               "name":"t.SRM-G",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 610"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Heinrich",
                           "lastName":"Kuhn",
                           "shortName":"kuhn"
                        },
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Andrea",
                           "lastName":"Muggli",
                           "shortName":"muga"
                        }
                     ],
                     "classes":[
                        {
                           "name":"T_AV09a.BA"
                        },
                        {
                           "name":"T_AV09b.BA"
                        },
                        {
                           "name":"T_AV09c.BA"
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T14:45:00",
                     "startTime":"2012-05-14T14:00:00"
                  },
                  {
                     "endTime":"2012-05-14T15:35:00",
                     "startTime":"2012-05-14T14:50:00"
                  },
                  {
                     "endTime":"2012-05-14T16:45:00",
                     "startTime":"2012-05-14T16:00:00"
                  },
                  {
                     "endTime":"2012-05-14T17:35:00",
                     "startTime":"2012-05-14T16:50:00"
                  }
               ],
               "startTime":"2012-05-14T14:00:00",
               "type":"CourseEvent"
            }
         ],
         "slots":[
            {
               "endTime":"2012-05-14T08:45:00",
               "startTime":"2012-05-14T08:00:00"
            },
            {
               "endTime":"2012-05-14T09:35:00",
               "startTime":"2012-05-14T08:50:00"
            },
            {
               "endTime":"2012-05-14T10:45:00",
               "startTime":"2012-05-14T10:00:00"
            },
            {
               "endTime":"2012-05-14T11:35:00",
               "startTime":"2012-05-14T10:50:00"
            },
            {
               "endTime":"2012-05-14T12:45:00",
               "startTime":"2012-05-14T12:00:00"
            },
            {
               "endTime":"2012-05-14T13:35:00",
               "startTime":"2012-05-14T12:50:00"
            },
            {
               "endTime":"2012-05-14T14:45:00",
               "startTime":"2012-05-14T14:00:00"
            },
            {
               "endTime":"2012-05-14T15:35:00",
               "startTime":"2012-05-14T14:50:00"
            },
            {
               "endTime":"2012-05-14T16:45:00",
               "startTime":"2012-05-14T16:00:00"
            },
            {
               "endTime":"2012-05-14T17:35:00",
               "startTime":"2012-05-14T16:50:00"
            },
            {
               "endTime":"2012-05-14T18:45:00",
               "startTime":"2012-05-14T18:00:00"
            },
            {
               "endTime":"2012-05-14T19:35:00",
               "startTime":"2012-05-14T18:50:00"
            },
            {
               "endTime":"2012-05-14T20:30:00",
               "startTime":"2012-05-14T19:45:00"
            },
            {
               "endTime":"2012-05-14T21:20:00",
               "startTime":"2012-05-14T20:35:00"
            }
         ]
      }
   ],
   "course":null,
   "lecturer":null,
   "room":{
      "name":"TB 610"
   },
   "class":null,
   "student":null
}
```

Example 17. Tagesstundenplan eines Raums in XML

Request:

```http
GET /v1/schedules/rooms/TB%20610?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schedule xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<type>Room</type>
<days>
    <day>
        <date>2012-05-14T00:00:00</date>
        <events>
            <event>
                <description>Corporate Network Infrastructure Vorlesung</description>
                <endTime>2012-05-14T09:35:00</endTime>
                <name>t.CNI-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 610</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Kurt</firstName>
                                <lastName>Hauser</lastName>
                                <shortName>husr</shortName>
                            </lecturer>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Hans</firstName>
                                <lastName>Weibel</lastName>
                                <shortName>wlan</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_SI09a.BA</name>
                            </class>
                            <class>
                                <name>T_UI09b.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T08:45:00</endTime>
                        <startTime>2012-05-14T08:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T09:35:00</endTime>
                        <startTime>2012-05-14T08:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T08:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description>Regelungstechnik 2 Vorlesung</description>
                <endTime>2012-05-14T13:35:00</endTime>
                <name>t.RT2-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 610</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Ruprecht</firstName>
                                <lastName>Altenburger</lastName>
                                <shortName>altb</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_ME09a.BA</name>
                            </class>
                            <class>
                                <name>T_ME09b.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T12:45:00</endTime>
                        <startTime>2012-05-14T12:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T13:35:00</endTime>
                        <startTime>2012-05-14T12:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T12:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description>Safety- und Riskmanagement - Gruppenunterricht</description>
                <endTime>2012-05-14T17:35:00</endTime>
                <name>t.SRM-G</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 610</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Heinrich</firstName>
                                <lastName>Kuhn</lastName>
                                <shortName>kuhn</shortName>
                            </lecturer>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Andrea</firstName>
                                <lastName>Muggli</lastName>
                                <shortName>muga</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name>T_AV09a.BA</name>
                            </class>
                            <class>
                                <name>T_AV09b.BA</name>
                            </class>
                            <class>
                                <name>T_AV09c.BA</name>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T14:45:00</endTime>
                        <startTime>2012-05-14T14:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T15:35:00</endTime>
                        <startTime>2012-05-14T14:50:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T16:45:00</endTime>
                        <startTime>2012-05-14T16:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T17:35:00</endTime>
                        <startTime>2012-05-14T16:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T14:00:00</startTime>
                <type>CourseEvent</type>
            </event>
        </events>
        <slots>
            <slot>
                <endTime>2012-05-14T08:45:00</endTime>
                <startTime>2012-05-14T08:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T09:35:00</endTime>
                <startTime>2012-05-14T08:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T10:45:00</endTime>
                <startTime>2012-05-14T10:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T11:35:00</endTime>
                <startTime>2012-05-14T10:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T12:45:00</endTime>
                <startTime>2012-05-14T12:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T13:35:00</endTime>
                <startTime>2012-05-14T12:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T14:45:00</endTime>
                <startTime>2012-05-14T14:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T15:35:00</endTime>
                <startTime>2012-05-14T14:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T16:45:00</endTime>
                <startTime>2012-05-14T16:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T17:35:00</endTime>
                <startTime>2012-05-14T16:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T18:45:00</endTime>
                <startTime>2012-05-14T18:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T19:35:00</endTime>
                <startTime>2012-05-14T18:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T20:30:00</endTime>
                <startTime>2012-05-14T19:45:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T21:20:00</endTime>
                <startTime>2012-05-14T20:35:00</startTime>
            </slot>
        </slots>
    </day>
</days>
<room>
    <name>TB 610</name>
</room>
</schedule>
```

### GET /v1/schedules/students/

Liefert einen Index mit den Studenten, für die Stundenpläne vorhanden  sind. Sind keine Studenten vorhanden, wird ein leerer Index  zurückgegeben.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/students/` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 18. Studenten-Index in JSON

Request:

```http
GET /v1/schedules/students/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort (gekürzt):

```json
{
    "students": [
        "abarorol",
        "abdalham",
        "abderlar",
        "acarina1",
        "achermar",
        "ackerdin",
        "ackermer",
        "ackersan",
        "zweiftam",
        "zwingtsu",
        "zynamsha",
        "zysseste"
    ]
}
```

Example 19. Studenten-Index in XML

Request:

```http
GET /v1/schedules/students/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort (gekürzt):

```xml
<?xml version="1.0"?>
<index xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <students>
    <student>abarorol</student>
    <student>abdalham</student>
    <student>abderlar</student>
    <student>acarina1</student>
    <student>achermar</student>
    <student>ackerdin</student>
    <!-- ... -->
    <student>zweidkar</student>
    <student>zweifnad</student>
    <student>zweifpat</student>
    <student>zweiftam</student>
    <student>zwingtsu</student>
    <student>zynamsha</student>
    <student>zysseste</student>
  </students>
</index>
```

### GET /v1/schedules/students/{name}

Retourniert den Stundenplan des Studenten mit dem Studentenkürzel ``name``.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/schedules/students/{name}?startingAt={date}&days={number}` 

- Cacheable

   nein 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                  | Beschreibung                                                 |
| ------------------------------------- | ------------------------------------------------------------ |
| **days** *searchpart, optional*       | Anzahl  Tage, die der Stundenplan umfassen soll. Es werden Werte aus dem  Intervall [1,7] akzeptiert. Wird die Anzahl Tage nicht angegeben, werden  standardmässig 7 Tage angezeigt. **Beispiel-Wert**: `6` |
| **name** *url-path, vorgeschrieben*   | Kürzel des Studenten, dessen Stundenplan abgerufen werden soll. **Beispiel-Wert**: `musteeri` |
| **startingAt** *searchpart, optional* | Datum,  mit dem der Stundenplan beginnen soll, in der Form JJJJ-MM-TT. Wird  kein Datum angegeben, wird das aktuelle Datum verwendet. **Beispiel-Wert**: `2012-05-18` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Werte für  übergebene Parameter sind illegal. Beispiel: Stundenplan soll mehr als 7  Tage lang sein. 

- `404 Not Found`

   Stundenplan kann nicht gefunden werden (Student unbekannt, kein Stundenplan für das gewählte Datum…) 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `504 Gateway Timeout`

   Einer der Drittservices, von denen der CampusInfo Server seine Daten bezieht, hat nicht (rechtzeitig) geantwortet. 

#### Beispiele

Example 20. Tagesstundenplan eines Studenten in JSON

Request:

```http
GET /v1/schedules/students/hablumat?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
   "type":"Student",
   "days":[
      {
         "date":"2012-05-14T00:00:00",
         "events":[
            {
               "description":"Corporate Network Infrastructure Vorlesung",
               "endTime":"2012-05-14T09:35:00",
               "name":"t.CNI-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TB 610"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Kurt",
                           "lastName":"Hauser",
                           "shortName":"husr"
                        },
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Hans",
                           "lastName":"Weibel",
                           "shortName":"wlan"
                        }
                     ],
                     "classes":[
                        {
                           "name":""
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T08:45:00",
                     "startTime":"2012-05-14T08:00:00"
                  },
                  {
                     "endTime":"2012-05-14T09:35:00",
                     "startTime":"2012-05-14T08:50:00"
                  }
               ],
               "startTime":"2012-05-14T08:00:00",
               "type":"CourseEvent"
            },
            {
               "description":"Nachrichtentechnik und Mobilkommunikation 2 Vorlesung",
               "endTime":"2012-05-14T11:35:00",
               "name":"t.NTM2-V",
               "eventRealizations":[
                  {
                     "room":{
                        "name":"TE 402"
                     },
                     "lecturers":[
                        {
                           "type":"Lecturer",
                           "department":null,
                           "firstName":"Marcel",
                           "lastName":"Rupf",
                           "shortName":"rumc"
                        }
                     ],
                     "classes":[
                        {
                           "name":""
                        }
                     ]
                  }
               ],
               "slots":[
                  {
                     "endTime":"2012-05-14T10:45:00",
                     "startTime":"2012-05-14T10:00:00"
                  },
                  {
                     "endTime":"2012-05-14T11:35:00",
                     "startTime":"2012-05-14T10:50:00"
                  }
               ],
               "startTime":"2012-05-14T10:00:00",
               "type":"CourseEvent"
            }
         ],
         "slots":[
            {
               "endTime":"2012-05-14T08:45:00",
               "startTime":"2012-05-14T08:00:00"
            },
            {
               "endTime":"2012-05-14T09:35:00",
               "startTime":"2012-05-14T08:50:00"
            },
            {
               "endTime":"2012-05-14T10:45:00",
               "startTime":"2012-05-14T10:00:00"
            },
            {
               "endTime":"2012-05-14T11:35:00",
               "startTime":"2012-05-14T10:50:00"
            },
            {
               "endTime":"2012-05-14T12:45:00",
               "startTime":"2012-05-14T12:00:00"
            },
            {
               "endTime":"2012-05-14T13:35:00",
               "startTime":"2012-05-14T12:50:00"
            },
            {
               "endTime":"2012-05-14T14:45:00",
               "startTime":"2012-05-14T14:00:00"
            },
            {
               "endTime":"2012-05-14T15:35:00",
               "startTime":"2012-05-14T14:50:00"
            },
            {
               "endTime":"2012-05-14T16:45:00",
               "startTime":"2012-05-14T16:00:00"
            },
            {
               "endTime":"2012-05-14T17:35:00",
               "startTime":"2012-05-14T16:50:00"
            },
            {
               "endTime":"2012-05-14T18:45:00",
               "startTime":"2012-05-14T18:00:00"
            },
            {
               "endTime":"2012-05-14T19:35:00",
               "startTime":"2012-05-14T18:50:00"
            },
            {
               "endTime":"2012-05-14T20:30:00",
               "startTime":"2012-05-14T19:45:00"
            },
            {
               "endTime":"2012-05-14T21:20:00",
               "startTime":"2012-05-14T20:35:00"
            }
         ]
      }
   ],
   "course":null,
   "lecturer":null,
   "room":null,
   "class":null,
   "student":{
      "type":"Student",
      "department":{
         "name":"T"
      },
      "firstName":null,
      "lastName":null,
      "shortName":"hablumat"
   }
}
```

Example 21. Tagesstundenplan eines Studenten in XML

Request:

```http
GET /v1/schedules/students/hablumat?startingAt=2012-05-14&days=1 HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schedule xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<type>Student</type>
<days>
    <day>
        <date>2012-05-14T00:00:00</date>
        <events>
            <event>
                <description>Corporate Network Infrastructure Vorlesung</description>
                <endTime>2012-05-14T09:35:00</endTime>
                <name>t.CNI-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TB 610</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Kurt</firstName>
                                <lastName>Hauser</lastName>
                                <shortName>husr</shortName>
                            </lecturer>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Hans</firstName>
                                <lastName>Weibel</lastName>
                                <shortName>wlan</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name/>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T08:45:00</endTime>
                        <startTime>2012-05-14T08:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T09:35:00</endTime>
                        <startTime>2012-05-14T08:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T08:00:00</startTime>
                <type>CourseEvent</type>
            </event>
            <event>
                <description>Nachrichtentechnik und Mobilkommunikation 2 Vorlesung</description>
                <endTime>2012-05-14T11:35:00</endTime>
                <name>t.NTM2-V</name>
                <eventRealizations>
                    <eventRealization>
                        <room>
                            <name>TE 402</name>
                        </room>
                        <lecturers>
                            <lecturer>
                                <type>Lecturer</type>
                                <firstName>Marcel</firstName>
                                <lastName>Rupf</lastName>
                                <shortName>rumc</shortName>
                            </lecturer>
                        </lecturers>
                        <classes>
                            <class>
                                <name/>
                            </class>
                        </classes>
                    </eventRealization>
                </eventRealizations>
                <slots>
                    <slot>
                        <endTime>2012-05-14T10:45:00</endTime>
                        <startTime>2012-05-14T10:00:00</startTime>
                    </slot>
                    <slot>
                        <endTime>2012-05-14T11:35:00</endTime>
                        <startTime>2012-05-14T10:50:00</startTime>
                    </slot>
                </slots>
                <startTime>2012-05-14T10:00:00</startTime>
                <type>CourseEvent</type>
            </event>
        </events>
        <slots>
            <slot>
                <endTime>2012-05-14T08:45:00</endTime>
                <startTime>2012-05-14T08:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T09:35:00</endTime>
                <startTime>2012-05-14T08:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T10:45:00</endTime>
                <startTime>2012-05-14T10:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T11:35:00</endTime>
                <startTime>2012-05-14T10:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T12:45:00</endTime>
                <startTime>2012-05-14T12:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T13:35:00</endTime>
                <startTime>2012-05-14T12:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T14:45:00</endTime>
                <startTime>2012-05-14T14:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T15:35:00</endTime>
                <startTime>2012-05-14T14:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T16:45:00</endTime>
                <startTime>2012-05-14T16:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T17:35:00</endTime>
                <startTime>2012-05-14T16:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T18:45:00</endTime>
                <startTime>2012-05-14T18:00:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T19:35:00</endTime>
                <startTime>2012-05-14T18:50:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T20:30:00</endTime>
                <startTime>2012-05-14T19:45:00</startTime>
            </slot>
            <slot>
                <endTime>2012-05-14T21:20:00</endTime>
                <startTime>2012-05-14T20:35:00</startTime>
            </slot>
        </slots>
    </day>
</days>
<student>
    <type>Student</type>
    <department>
        <name>T</name>
    </department>
    <shortName>hablumat</shortName>
</student>
</schedule>
```

## Mensa-Ressourcen

### GET /v1/catering/facilities/

Retourniert Liste der Mensen und Cafeterien für alle unterstützte ZHAW-Standorte inklusive ihrer Öffnungszeiten und Ferientage.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/catering/facilities` 

- Cacheable

   ja ([ETag](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#preface-caching-client-etags)) 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

#### Beispiele

Example 22. Liste der ZHAW-Mensen und Cafeterien in JSON

Request:

```http
GET /v1/catering/facilities/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
    "gastronomicFacilities": [
        {
            "holidays": [
                {
                    "endsAt": "2013-05-02T00:00:00+02:00",
                    "id": 1,
                    "name": "1. Mai",
                    "startsAt": "2013-05-01T00:00:00+02:00",
                    "version": "AAAAAAAAC7w="
                }
            ],
            "id": 2,
            "location": {
                "id": 1,
                "name": "Winterthur",
                "version": "AAAAAAAAB9E="
            },
            "name": "St. Georgenplatz",
            "serviceTimePeriods": [
                {
                    "endsOn": "2013-06-02T00:00:00+02:00",
                    "id": 2,
                    "lunchTimePlan": {
                        "type": "LunchTimePlan",
                        "wednesday": {
                            "from": "11:00",
                            "type": "LunchTime",
                            "until": "13:45"
                        }
                    },
                    "openingTimePlan": {
                        "type": "OpeningTimePlan",
                        "wednesday": {
                            "from": "07:00",
                            "type": "OpeningTime",
                            "until": "20:00"
                        }
                    },
                    "startsOn": "2013-02-18T00:00:00+01:00",
                    "version": "AAAAAAAAC74="
                }
            ],
            "type": "Canteen",
            "version": "AAAAAAAAC7o="
        }
    ]
}
```

Example 23. Liste der ZHAW-Mensen und Cafeterien in XML

Request:

```http
GET /v1/catering/facilities/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0"?>
<gastronomicFacilityList xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <gastronomicFacilities>
    <gastronomicFacility>
      <holidays>
        <holiday>
          <endsAt>2013-05-02T00:00:00+02:00</endsAt>
          <id>1</id>
          <name>1. Mai</name>
          <startsAt>2013-05-01T00:00:00+02:00</startsAt>
          <version>AAAAAAAAC7w=</version>
        </holiday>
        <holiday>
          <endsAt>2013-05-10T00:00:00+02:00</endsAt>
          <id>2</id>
          <name>Auffahrt</name>
          <startsAt>2013-05-08T16:00:00+02:00</startsAt>
          <version>AAAAAAAAD6E=</version>
        </holiday>
      </holidays>
      <id>2</id>
      <location>
        <id>1</id>
        <name>Winterthur</name>
        <version>AAAAAAAAB9E=</version>
      </location>
      <name>St. Georgenplatz</name>
      <serviceTimePeriods>
        <serviceTimePeriod>
          <endsOn>2013-06-02T00:00:00+02:00</endsOn>
          <id>2</id>
          <lunchTimePlan>
            <friday>
              <from>11:00</from>
              <type>LunchTime</type>
              <until>13:45</until>
            </friday>
            <monday>
              <from>11:00</from>
              <type>LunchTime</type>
              <until>13:45</until>
            </monday>
            <saturday>
              <type>LunchTime</type>
            </saturday>
            <sunday>
              <type>LunchTime</type>
            </sunday>
            <thursday>
              <from>11:00</from>
              <type>LunchTime</type>
              <until>13:45</until>
            </thursday>
            <tuesday>
              <from>11:00</from>
              <type>LunchTime</type>
              <until>13:45</until>
            </tuesday>
            <type>LunchTimePlan</type>
            <wednesday>
              <from>11:00</from>
              <type>LunchTime</type>
              <until>13:45</until>
            </wednesday>
          </lunchTimePlan>
          <openingTimePlan>
            <friday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>16:00</until>
            </friday>
            <monday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>20:00</until>
            </monday>
            <saturday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>13:00</until>
            </saturday>
            <sunday>
              <type>OpeningTime</type>
            </sunday>
            <thursday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>20:00</until>
            </thursday>
            <tuesday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>20:00</until>
            </tuesday>
            <type>OpeningTimePlan</type>
            <wednesday>
              <from>07:00</from>
              <type>OpeningTime</type>
              <until>20:00</until>
            </wednesday>
          </openingTimePlan>
          <startsOn>2013-02-18T00:00:00+01:00</startsOn>
          <version>AAAAAAAAC74=</version>
        </serviceTimePeriod>
      </serviceTimePeriods>
      <type>Canteen</type>
      <version>AAAAAAAAC7o=</version>
    </gastronomicFacility>
  </gastronomicFacilities>
</gastronomicFacilityList>
```

### GET /v1/catering/menuplans/years/{year}/weeks/{week}/

Retourniert Liste mit allen Menüplänen, die für die gewünschte Kalenderwoche des angegebenen Jahres hinterlegt sind.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/catering/menuplans/years/{year}/weeks/{week}/` 

- Cacheable

   ja ([ETag](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#preface-caching-client-etags)) 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

| Name                                | Beschreibung                                                 |
| ----------------------------------- | ------------------------------------------------------------ |
| **week** *url-path, vorgeschrieben* | Nummer der [Kalenderwoche nach ISO 8601](https://de.wikipedia.org/w/index.php?title=Woche&oldid=119565740#Z.C3.A4hlweise_nach_ISO_8601) im gewählten Jahr, für die die Liste der Menüpläne abgerufen werden soll. **Beispiel-Wert**: `8` |
| **year** *url-path, vorgeschrieben* | Jahr der Kalenderwoche, für die die Liste der Menüpläne abgerufen werden soll. **Beispiel-Wert**: `2013` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Parameter ungültig (z.B. ungültige Kalenderwochennummer). 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

#### Beispiele

Example 24. Liste der Menüpläne für die Woche 08/2013

Request:

```http
GET /v1/catering/menuplans/years/2013/weeks/8/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
    "menuPlans": [
        {
            "calendarWeek": {
                "week": 8,
                "year": 2013
            },
            "gastronomicFacilityIds": [
                1,
                2,
                3
            ],
            "id": 2,
            "menus": [
                {
                    "dishes": [
                        {
                            "externalPrice": 11.0,
                            "id": 16,
                            "internalPrice": 7.0,
                            "label": "Tagesmenu",
                            "name": "Pouletgeschnetzeltes \"Casimir\" (BR)",
                            "priceForPartners": 8.0,
                            "sideDishes": [
                                {
                                    "id": 31,
                                    "name": "an Currysauce mit Fr\u00fcchten",
                                    "version": "AAAAAAAADAU="
                                },
                                {
                                    "id": 32,
                                    "name": "Trockenreis",
                                    "version": "AAAAAAAADAY="
                                },
                                {
                                    "id": 33,
                                    "name": "Menusalat",
                                    "version": "AAAAAAAADAc="
                                }
                            ],
                            "version": "AAAAAAAAC/U="
                        },
                        {
                            "externalPrice": 9.5,
                            "id": 17,
                            "internalPrice": 5.5,
                            "label": "Budget Menu (Nur im Technikum)",
                            "name": "Kartoffelgratin",
                            "priceForPartners": 6.5,
                            "sideDishes": [
                                {
                                    "id": 34,
                                    "name": "mit Lauch und K\u00e4se",
                                    "version": "AAAAAAAADAg="
                                }
                            ],
                            "version": "AAAAAAAAC/Y="
                        },
                        {
                            "externalPrice": 10.0,
                            "id": 18,
                            "internalPrice": 6.0,
                            "label": "Vegimenu",
                            "name": "\"Tortiglioni del Patrone\"",
                            "priceForPartners": 7.0,
                            "sideDishes": [
                                {
                                    "id": 35,
                                    "name": "mit getrockneten Tomaten",
                                    "version": "AAAAAAAADAk="
                                },
                                {
                                    "id": 36,
                                    "name": "und Champignons",
                                    "version": "AAAAAAAADAo="
                                }
                            ],
                            "version": "AAAAAAAAC/c="
                        }
                    ],
                    "id": 6,
                    "offeredOn": "2013-02-19T00:00:00+01:00",
                    "version": "AAAAAAAAC/Q="
                },
                {
                    "dishes": [
                        {
                            "externalPrice": 11.0,
                            "id": 19,
                            "internalPrice": 7.0,
                            "label": "Tagesmenu",
                            "name": "Pochiertes Flunderfilet (NL)",
                            "priceForPartners": 8.0,
                            "sideDishes": [
                                {
                                    "id": 37,
                                    "name": "mit Curcuma-Dillsauce",
                                    "version": "AAAAAAAADAs="
                                },
                                {
                                    "id": 38,
                                    "name": "Salzkartoffeln",
                                    "version": "AAAAAAAADAw="
                                },
                                {
                                    "id": 39,
                                    "name": "Fenchel gebraten",
                                    "version": "AAAAAAAADA0="
                                }
                            ],
                            "version": "AAAAAAAAC/k="
                        },
                        {
                            "externalPrice": 9.5,
                            "id": 20,
                            "internalPrice": 5.5,
                            "label": "Budget Menu (Nur im Technikum)",
                            "name": "Teigwaren",
                            "priceForPartners": 6.5,
                            "sideDishes": [
                                {
                                    "id": 40,
                                    "name": "an Tomatensauce",
                                    "version": "AAAAAAAADA4="
                                },
                                {
                                    "id": 41,
                                    "name": "und Pilz",
                                    "version": "AAAAAAAADA8="
                                }
                            ],
                            "version": "AAAAAAAAC/o="
                        },
                        {
                            "externalPrice": 10.0,
                            "id": 21,
                            "internalPrice": 6.0,
                            "label": "Vegimenu",
                            "name": "K\u00e4sekuchen",
                            "priceForPartners": 7.0,
                            "sideDishes": [
                                {
                                    "id": 42,
                                    "name": "mit saisonaler Salatgarnitur",
                                    "version": "AAAAAAAADBA="
                                }
                            ],
                            "version": "AAAAAAAAC/s="
                        }
                    ],
                    "id": 7,
                    "offeredOn": "2013-02-20T00:00:00+01:00",
                    "version": "AAAAAAAAC/g="
                },
                {
                    "dishes": [
                        {
                            "externalPrice": 11.0,
                            "id": 22,
                            "internalPrice": 7.0,
                            "label": "Tagesmenu",
                            "name": "Rindsbraten (CH)",
                            "priceForPartners": 8.0,
                            "sideDishes": [
                                {
                                    "id": 43,
                                    "name": "an Portweinjus",
                                    "version": "AAAAAAAADBE="
                                },
                                {
                                    "id": 44,
                                    "name": "Griessgnocchi",
                                    "version": "AAAAAAAADBI="
                                },
                                {
                                    "id": 45,
                                    "name": "R\u00fcebli",
                                    "version": "AAAAAAAADBM="
                                }
                            ],
                            "version": "AAAAAAAAC/0="
                        },
                        {
                            "externalPrice": 9.5,
                            "id": 23,
                            "internalPrice": 5.5,
                            "label": "Budget Menu (Nur im Technikum)",
                            "name": "Pastagratin",
                            "priceForPartners": 6.5,
                            "sideDishes": [
                                {
                                    "id": 46,
                                    "name": "mit Tomaten und",
                                    "version": "AAAAAAAADBQ="
                                },
                                {
                                    "id": 47,
                                    "name": "Mozzarella \u00fcberbacken",
                                    "version": "AAAAAAAADBU="
                                }
                            ],
                            "version": "AAAAAAAAC/4="
                        },
                        {
                            "externalPrice": 10.0,
                            "id": 24,
                            "internalPrice": 6.0,
                            "label": "Vegimenu",
                            "name": "Kartoffelgnocchi",
                            "priceForPartners": 7.0,
                            "sideDishes": [
                                {
                                    "id": 48,
                                    "name": "an Currysauce",
                                    "version": "AAAAAAAADBY="
                                },
                                {
                                    "id": 49,
                                    "name": "mit Sonnenblumenkernen und Lauch",
                                    "version": "AAAAAAAADBc="
                                }
                            ],
                            "version": "AAAAAAAAC/8="
                        }
                    ],
                    "id": 8,
                    "offeredOn": "2013-02-21T00:00:00+01:00",
                    "version": "AAAAAAAAC/w="
                },
                {
                    "dishes": [
                        {
                            "externalPrice": 11.0,
                            "id": 25,
                            "internalPrice": 7.0,
                            "label": "Tagesmenu",
                            "name": "Spaghetti",
                            "priceForPartners": 8.0,
                            "sideDishes": [
                                {
                                    "id": 50,
                                    "name": "Bolognaise",
                                    "version": "AAAAAAAADBg="
                                },
                                {
                                    "id": 51,
                                    "name": "mit Rindfleisch (CH)",
                                    "version": "AAAAAAAADBk="
                                },
                                {
                                    "id": 52,
                                    "name": "Tagessalat",
                                    "version": "AAAAAAAADBo="
                                }
                            ],
                            "version": "AAAAAAAADAI="
                        },
                        {
                            "externalPrice": 9.5,
                            "id": 26,
                            "internalPrice": 5.5,
                            "label": "Budget Menu (Nur im Technikum)",
                            "name": "Teigwaren",
                            "priceForPartners": 6.5,
                            "sideDishes": [
                                {
                                    "id": 53,
                                    "name": "an Kr\u00e4utersauce",
                                    "version": "AAAAAAAADBs="
                                }
                            ],
                            "version": "AAAAAAAADAM="
                        },
                        {
                            "externalPrice": 10.0,
                            "id": 27,
                            "internalPrice": 6.0,
                            "label": "Vegimenu",
                            "name": "Gem\u00fcse-Pilzrago\u00fbt",
                            "priceForPartners": 7.0,
                            "sideDishes": [
                                {
                                    "id": 54,
                                    "name": "an Harissasauce",
                                    "version": "AAAAAAAADBw="
                                },
                                {
                                    "id": 55,
                                    "name": "Indischer Gew\u00fcrzreis",
                                    "version": "AAAAAAAADB0="
                                }
                            ],
                            "version": "AAAAAAAADAQ="
                        }
                    ],
                    "id": 9,
                    "offeredOn": "2013-02-22T00:00:00+01:00",
                    "version": "AAAAAAAADAE="
                }
            ],
            "version": "AAAAAAAAC/M="
        }
    ]
}
```

Example 25. Liste der Menüpläne für die Woche 08/2013

Request:

```http
GET /v1/catering/menuplans/years/2013/weeks/8/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0"?>
<menuPlanList xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <menuPlans>
    <menuPlan>
      <calendarWeek>
        <week>8</week>
        <year>2013</year>
      </calendarWeek>
      <gastronomicFacilityIds>
        <gastronomicFacilityId>1</gastronomicFacilityId>
        <gastronomicFacilityId>2</gastronomicFacilityId>
        <gastronomicFacilityId>3</gastronomicFacilityId>
      </gastronomicFacilityIds>
      <id>2</id>
      <menus>
        <menu>
          <dishes>
            <dish>
              <externalPrice>11.0000</externalPrice>
              <id>16</id>
              <internalPrice>7.0000</internalPrice>
              <label>Tagesmenu</label>
              <name>Pouletgeschnetzeltes "Casimir" (BR)</name>
              <priceForPartners>8.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>31</id>
                  <name>an Currysauce mit Fr&#xFC;chten</name>
                  <version>AAAAAAAADAU=</version>
                </sideDish>
                <sideDish>
                  <id>32</id>
                  <name>Trockenreis</name>
                  <version>AAAAAAAADAY=</version>
                </sideDish>
                <sideDish>
                  <id>33</id>
                  <name>Menusalat</name>
                  <version>AAAAAAAADAc=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/U=</version>
            </dish>
            <dish>
              <externalPrice>9.5000</externalPrice>
              <id>17</id>
              <internalPrice>5.5000</internalPrice>
              <label>Budget Menu (Nur im Technikum)</label>
              <name>Kartoffelgratin</name>
              <priceForPartners>6.5000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>34</id>
                  <name>mit Lauch und K&#xE4;se</name>
                  <version>AAAAAAAADAg=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/Y=</version>
            </dish>
            <dish>
              <externalPrice>10.0000</externalPrice>
              <id>18</id>
              <internalPrice>6.0000</internalPrice>
              <label>Vegimenu</label>
              <name>"Tortiglioni del Patrone"</name>
              <priceForPartners>7.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>35</id>
                  <name>mit getrockneten Tomaten</name>
                  <version>AAAAAAAADAk=</version>
                </sideDish>
                <sideDish>
                  <id>36</id>
                  <name>und Champignons</name>
                  <version>AAAAAAAADAo=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/c=</version>
            </dish>
          </dishes>
          <id>6</id>
          <offeredOn>2013-02-19T00:00:00+01:00</offeredOn>
          <version>AAAAAAAAC/Q=</version>
        </menu>
        <menu>
          <dishes>
            <dish>
              <externalPrice>11.0000</externalPrice>
              <id>19</id>
              <internalPrice>7.0000</internalPrice>
              <label>Tagesmenu</label>
              <name>Pochiertes Flunderfilet (NL)</name>
              <priceForPartners>8.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>37</id>
                  <name>mit Curcuma-Dillsauce</name>
                  <version>AAAAAAAADAs=</version>
                </sideDish>
                <sideDish>
                  <id>38</id>
                  <name>Salzkartoffeln</name>
                  <version>AAAAAAAADAw=</version>
                </sideDish>
                <sideDish>
                  <id>39</id>
                  <name>Fenchel gebraten</name>
                  <version>AAAAAAAADA0=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/k=</version>
            </dish>
            <dish>
              <externalPrice>9.5000</externalPrice>
              <id>20</id>
              <internalPrice>5.5000</internalPrice>
              <label>Budget Menu (Nur im Technikum)</label>
              <name>Teigwaren</name>
              <priceForPartners>6.5000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>40</id>
                  <name>an Tomatensauce</name>
                  <version>AAAAAAAADA4=</version>
                </sideDish>
                <sideDish>
                  <id>41</id>
                  <name>und Pilz</name>
                  <version>AAAAAAAADA8=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/o=</version>
            </dish>
            <dish>
              <externalPrice>10.0000</externalPrice>
              <id>21</id>
              <internalPrice>6.0000</internalPrice>
              <label>Vegimenu</label>
              <name>K&#xE4;sekuchen</name>
              <priceForPartners>7.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>42</id>
                  <name>mit saisonaler Salatgarnitur</name>
                  <version>AAAAAAAADBA=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/s=</version>
            </dish>
          </dishes>
          <id>7</id>
          <offeredOn>2013-02-20T00:00:00+01:00</offeredOn>
          <version>AAAAAAAAC/g=</version>
        </menu>
        <menu>
          <dishes>
            <dish>
              <externalPrice>11.0000</externalPrice>
              <id>22</id>
              <internalPrice>7.0000</internalPrice>
              <label>Tagesmenu</label>
              <name>Rindsbraten (CH)</name>
              <priceForPartners>8.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>43</id>
                  <name>an Portweinjus</name>
                  <version>AAAAAAAADBE=</version>
                </sideDish>
                <sideDish>
                  <id>44</id>
                  <name>Griessgnocchi</name>
                  <version>AAAAAAAADBI=</version>
                </sideDish>
                <sideDish>
                  <id>45</id>
                  <name>R&#xFC;ebli</name>
                  <version>AAAAAAAADBM=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/0=</version>
            </dish>
            <dish>
              <externalPrice>9.5000</externalPrice>
              <id>23</id>
              <internalPrice>5.5000</internalPrice>
              <label>Budget Menu (Nur im Technikum)</label>
              <name>Pastagratin</name>
              <priceForPartners>6.5000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>46</id>
                  <name>mit Tomaten und</name>
                  <version>AAAAAAAADBQ=</version>
                </sideDish>
                <sideDish>
                  <id>47</id>
                  <name>Mozzarella &#xFC;berbacken</name>
                  <version>AAAAAAAADBU=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/4=</version>
            </dish>
            <dish>
              <externalPrice>10.0000</externalPrice>
              <id>24</id>
              <internalPrice>6.0000</internalPrice>
              <label>Vegimenu</label>
              <name>Kartoffelgnocchi</name>
              <priceForPartners>7.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>48</id>
                  <name>an Currysauce</name>
                  <version>AAAAAAAADBY=</version>
                </sideDish>
                <sideDish>
                  <id>49</id>
                  <name>mit Sonnenblumenkernen und Lauch</name>
                  <version>AAAAAAAADBc=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAAC/8=</version>
            </dish>
          </dishes>
          <id>8</id>
          <offeredOn>2013-02-21T00:00:00+01:00</offeredOn>
          <version>AAAAAAAAC/w=</version>
        </menu>
        <menu>
          <dishes>
            <dish>
              <externalPrice>11.0000</externalPrice>
              <id>25</id>
              <internalPrice>7.0000</internalPrice>
              <label>Tagesmenu</label>
              <name>Spaghetti</name>
              <priceForPartners>8.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>50</id>
                  <name>Bolognaise</name>
                  <version>AAAAAAAADBg=</version>
                </sideDish>
                <sideDish>
                  <id>51</id>
                  <name>mit Rindfleisch (CH)</name>
                  <version>AAAAAAAADBk=</version>
                </sideDish>
                <sideDish>
                  <id>52</id>
                  <name>Tagessalat</name>
                  <version>AAAAAAAADBo=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAADAI=</version>
            </dish>
            <dish>
              <externalPrice>9.5000</externalPrice>
              <id>26</id>
              <internalPrice>5.5000</internalPrice>
              <label>Budget Menu (Nur im Technikum)</label>
              <name>Teigwaren</name>
              <priceForPartners>6.5000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>53</id>
                  <name>an Kr&#xE4;utersauce</name>
                  <version>AAAAAAAADBs=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAADAM=</version>
            </dish>
            <dish>
              <externalPrice>10.0000</externalPrice>
              <id>27</id>
              <internalPrice>6.0000</internalPrice>
              <label>Vegimenu</label>
              <name>Gem&#xFC;se-Pilzrago&#xFB;t</name>
              <priceForPartners>7.0000</priceForPartners>
              <sideDishes>
                <sideDish>
                  <id>54</id>
                  <name>an Harissasauce</name>
                  <version>AAAAAAAADBw=</version>
                </sideDish>
                <sideDish>
                  <id>55</id>
                  <name>Indischer Gew&#xFC;rzreis</name>
                  <version>AAAAAAAADB0=</version>
                </sideDish>
              </sideDishes>
              <version>AAAAAAAADAQ=</version>
            </dish>
          </dishes>
          <id>9</id>
          <offeredOn>2013-02-22T00:00:00+01:00</offeredOn>
          <version>AAAAAAAADAE=</version>
        </menu>
      </menus>
      <version>AAAAAAAAC/M=</version>
    </menuPlan>
  </menuPlans>
</menuPlanList>
```

## Feed-Ressourcen

### GET /v1/feeds

Retourniert Liste mit Metadaten zu den vorhandenen Feeds.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/feeds` 

- Cacheable

   ja ([ETag](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#preface-caching-client-etags), Cache-Control) 

- Authentifzierung nötig

   nein 

- Media Types

   `application/json` und `application/xml` 

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten oder im falschen Format. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `application/json` bzw. `application/xml`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

#### Beispiele

Example 26. Liste der Feeds JSON

Request:

```http
GET /v1/feeds/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/json
```

Antwort:

```json
{
    "feeds": [
        {
            "cacheExpiresAfter": "01:00",
            "identifier": "soe-events",
            "name": "Veranstaltungen School of Engineering",
            "type": "EventFeed",
            "url": "http://www.engineering.zhaw.ch/de/engineering/rss-veranstaltungen-engineering.html",
            "version": "AAAAAAAAE40="
        },
        {
            "cacheExpiresAfter": "01:00",
            "identifier": "soe-news",
            "name": "News School of Engineering",
            "type": "NewsFeed",
            "url": "http://www.engineering.zhaw.ch/de/engineering/rss-school-of-engineering.html",
            "version": "AAAAAAAAE4w="
        }
    ]
}
```

Example 27. Liste der Feeds in XML

Request:

```http
GET /v1/feeds/ HTTP/1.1
Host: api.apps.engineering.zhaw.ch
User-Agent: ZHAWCampusInfoDemo (http://init.zhaw.ch/)
Accept: application/xml
```

Antwort:

```xml
<?xml version="1.0"?>
<feedList xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <feeds>
    <feed>
      <cacheExpiresAfter>01:00</cacheExpiresAfter>
      <identifier>soe-events</identifier>
      <name>Veranstaltungen School of Engineering</name>
      <type>EventFeed</type>
      <url>http://www.engineering.zhaw.ch/de/engineering/rss-veranstaltungen-engineering.html</url>
      <version>AAAAAAAAE40=</version>
    </feed>
    <feed>
      <cacheExpiresAfter>01:00</cacheExpiresAfter>
      <identifier>soe-news</identifier>
      <name>News School of Engineering</name>
      <type>NewsFeed</type>
      <url>http://www.engineering.zhaw.ch/de/engineering/rss-school-of-engineering.html</url>
      <version>AAAAAAAAE4w=</version>
    </feed>
  </feeds>
</feedList>
```

### GET /v1/feeds/{identifier}/feed/

Retourniert den gewünschten Feed.

Ressourcen-Informationen

- URL

   `https://api.apps.engineering.zhaw.ch/v1/feeds/{identifier}/feed/` 

- Cacheable

   ja ([ETag](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#preface-caching-client-etags), Cache-Control) 

- Authentifzierung nötig

   nein 

- Media Types

   `*/*` 

| Name                                      | Beschreibung                                                 |
| ----------------------------------------- | ------------------------------------------------------------ |
| **identifier** *url-path, vorgeschrieben* | Identifier des jeweiligen Feeds. **Beispiel-Wert**: `zhaw-news` |

Mögliche Fehler

- `400 Bad Request`

   User-Agent Header nicht enthalten, im falschen Format oder Parameter ungültig. 

- `404 Not Found`

   Ein Feed mit dem angegebenen Identifier existiert nicht. 

- `406 Not Acceptable`

   Der `Accept`-Header bei der Anfrage war nicht `*/*`. 

- `500 Internal Server Error`

   Beim Verarbeiten der Anfrage ist ein nicht näher spezifizierter Fehler aufgetreten. 

- `502 Bad Gateway`

   Der Feed konnte aufgrund eines Problems beim Quellserver nicht bereitgestellt werden. 

## Objekte

### Allgemein

#### Error

Generisches Fehler-Objekt, das zurückgegeben wird, wenn bei der Verarbeitung eines Anfrage ein HTTP-Fehler auftritt.

| Name      | Typ    | Beschreibung    |
| --------- | ------ | --------------- |
| `Message` | String | Fehlernachricht |

Example 28. Fehlermeldung in JSON

```json
{
    "Message": "An exception occurred."
}
```

Example 29. Fehlermeldung in XML

```xml
<?xml version="1.0"?>
<Error>
  <Message>An exception occurred during.</Message>
</Error>
```

### Stundenpläne

#### Gebäude

##### Department

Repräsentiert eine Abteilung der ZHAW wie die School of Engineering.

| Name   | Typ    | Beschreibung                                  |
| ------ | ------ | --------------------------------------------- |
| `name` | String | Name des Departements. **Beispiel-Wert**: `T` |

Example 30. Department-Objekt in JSON

```json
{
   "name":"T"
}
```

Example 31. Department-Objekt in XML

```xml
<?xml version="1.0"?>
<department>
    <name>T</name>
</department>
```

##### Room

Repräsentiert einen Raum auf dem Campus der ZHAW.

| Name   | Typ    | Beschreibung                                |
| ------ | ------ | ------------------------------------------- |
| `name` | String | Name des Raums. **Beispiel-Wert**: `TB 610` |

Example 32. Room-Objekt in JSON

```json
{
   "name":"TL 201"
}
```

Example 33. Room-Objekt in XML

```xml
<?xml version="1.0"?>
<room>
    <name>TL 201</name>
</room>
```

#### Personen

##### Person

Repräsentiert eine Person, die in irgendeiner Form an der ZHAW registriert ist.

| Name         | Typ                                                          | Beschreibung                                                 |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `department` | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-department) | Departement, zu dem die Person gehört.                       |
| `firstName`  | String                                                       | Vorname der Person. **Beispiel-Wert:** `Erika`               |
| `lastName`   | String                                                       | Nachname der Person. **Beispiel-Wert:** `Mustermann`         |
| `shortName`  | String                                                       | Kürzel der Person, bei Dozenten typischerweise 4 Zeichen lang, bei Studenten 8 Zeichen. **Beispiel-Wert:** `musteeri` |
| `type`       | String                                                       | Typ der Person. Gültige Werte sind: `Employee` (regulärer Angestellter), `Lecturer` (Dozent), `Student` (Student) |

Example 34. Person-Objekt in JSON

```json
{
   "type":"Lecturer",
   "department":{
      "name":"T"
   },
   "firstName":"Erika",
   "lastName":"Mustermann",
   "shortName":"muer"
}
```

Example 35. Person-Objekt in XML

```xml
<?xml version="1.0"?>
<lecturer>
    <type>Lecturer</type>
    <department>
        <name>T</name>
    </department>
    <firstName>Hanfried</firstName>
    <lastName>Hesselbarth</lastName>
    <shortName>hsbh</shortName>
</lecturer>
```

#### Stundenpläne

##### Class

Repräsentiert eine Schulklasse.

| Name   | Typ    | Beschreibung                                          |
| ------ | ------ | ----------------------------------------------------- |
| `name` | String | Name der Schulklasse. **Beispiel-Wert**: `T_AV10a.BA` |

Example 36. Class-Objekt in JSON

```json
{
   "name":"T_AV10a.BA"
}
```

Example 37. Class-Objekt in XML

```xml
<?xml version="1.0"?>
<class>
    <name>T_AV10a.BA</name>
</class>
```

##### Course

Repräsentiert eine Veranstaltungsart eines Moduls, zum Beispiel Übungen oder Vorlesung.

| Name          | Typ    | Beschreibung                                                 |
| ------------- | ------ | ------------------------------------------------------------ |
| `description` | String | Beschreibung des Kurses. **Beispiel-Wert**: `Java für Fortgeschrittene - Praktikum` |
| `name`        | String | Name des Kurses. **Beispiel-Wert**: `t.JFF-P`                |

Example 38. Course-Objekt in JSON

```json
{
   "description": "Java für Fortgeschrittene - Praktikum",
   "name": "t.JFF-P"
}
```

Example 39. Course-Objekt in XML

```xml
<?xml version="1.0"?>
<course>
    <description>Java für Fortgeschrittene - Praktikum</description>
    <name>T_AV10a.BA</name>
</course>
```

##### Event

Repräsentiert eine Veranstaltung (Ferien, Unterricht), die an einem einzelnen Tag des Stundenplans stattfindet.

| Name                | Typ                                                          | Beschreibung                                                 |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `description`       | String                                                       | Beschreibung der Veranstaltung. **Beispiel-Wert**: `Java für Fortgeschrittene - Praktikum` |
| `endTime`           | DateTime                                                     | Zeit, zu der die Lektion endet, nach ISO 8601. **Beispiel-Wert**: `2012-05-15T08:45:00` |
| `eventRealizations` | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-eventrealization) | Liste der Durchführungen dieser Veranstaltung, die an demselben Tag stattfinden. |
| `name`              | String                                                       | Name des Veranstaltung. **Beispiel-Wert**: `t.JFF-P`         |
| `slots`             | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-slot) | Liste von Lektionen, die von der Veranstaltung belegt werden. |
| `startTime`         | DateTime                                                     | Zeit, zu der die Lektion beginnt, nach ISO 8601. **Beispiel-Wert**: `2012-05-15T08:00:00` |
| `type`              | String                                                       | Typ der Veranstaltung. Gültige Werte sind: `CourseEvent` (Unterricht), `Holiday` (Feiertag) |

Example 40. Event-Objekt in JSON

```json
{
    "description": "",
    "endTime": "2012-05-14T09:35:00",
    "eventRealizations": [],
    "name": "t.TEMS-V",
    "slots": [],
    "startTime": "2012-05-14T08:00:00",
    "type": "CourseEvent"
}
```

Example 41. Event-Objekt in XML

```xml
<?xml version="1.0"?>
<event>
  <description/>
  <endTime>2012-05-14T09:35:00</endTime>
  <name>t.TEMS-V</name>
  <eventRealizations/>
  <slots/>
  <startTime>2012-05-14T08:00:00</startTime>
  <type>CourseEvent</type>
</event>
```

##### EventRealization

Repräsentiert eine von eventuell mehreren parallelen Durchführungen  einer Veranstaltung. Sind zum Beispiel “zu viele” Studenten für eine  Veranstaltung angemeldet, können verschiedene Dozenten sie gleichzeitig  parallel in zwei verschiedenen Räumen betreuen.

| Name        | Typ                                                          | Beschreibung                                                 |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `classes`   | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-class) | Liste von Klassen, die bei dieser Durchführung der Veranstaltung anwesend sind. |
| `lecturers` | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-person) | Liste der Dozenten, die diese Durchführung der Veranstaltung betreuen. |
| `room`      | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-room) | Raum, in dem Durchführung der Veranstaltung stattfindet.     |

Example 42. EventRealization-Objekt in JSON

```json
{
	"classes": [
		{
			"name": "T_AV10a.BA"
		}
	],
	"lecturers": [
		{
			"department": null,
			"firstName": "Hanfried",
			"lastName": "Hesselbarth",
			"shortName": "hsbh",
			"type": "Lecturer"
		}
	],
	"room": {
		"name": "TL 201"
	}
}
```

Example 43. EventRealization-Objekt in XML

```xml
<?xml version="1.0"?>
<eventRealization>
  <room>
	<name>TL 201</name>
  </room>
  <lecturers>
	<lecturer>
	  <type>Lecturer</type>
	  <firstName>Hanfried</firstName>
	  <lastName>Hesselbarth</lastName>
	  <shortName>hsbh</shortName>
	</lecturer>
  </lecturers>
  <classes>
	<class>
	  <name>T_AV10a.BA</name>
	</class>
  </classes>
</eventRealization>
```

##### Day

Repräsentiert einen Tag, der Teil des Stundenplans ist.

| Name     | Typ                                                          | Beschreibung                                                 |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `date`   | DateTime                                                     | Datum des Tages nach ISO 8601. **Beispiel-Wert**: `2012-05-14T00:00:00` |
| `events` | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-event) | Liste der Veranstaltungen, die an diesem Tag stattfinden.    |
| `slots`  | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-slot) | Liste von Lektionen, in denen an diesem Tag Veranstaltungen stattfinden können. Dient zum Aufbau des Stundenrasters. |

Example 44. Day-Objekt in JSON

```json
{
   "date":"2012-05-14T00:00:00",
   "events":[],
   "slots":[]
}
```

Example 45. Day-Objekt in XML

```xml
<day>
	<date>2012-05-14T00:00:00</date>
	<events/>
	<slots/>
</day>
```

##### Schedule

Repräsentiert einen Stundenplan, der eine bestimmte Anzahl von Tagen  umfasst und entweder zu einer Klasse, einem Kurs, einem Dozenten, einem  Studenten oder einem Raum gehört.

| Name       | Typ                                                          | Beschreibung                                                 |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `class`    | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-class) | Schulkasse, für die der Stundenplan ist. Nur gesetzt, falls der Typ des Stundenplans `Class` ist. |
| `course`   | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-course) | Kurs, für den der Stundenplan ist. Nur gesetzt, falls der Typ des Stundenplans `Course` ist. |
| `days`     | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-day) | Liste der Tage, die der Stundenplan umfasst.                 |
| `lecturer` | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-person) | Dozent, für den der Stundenplan ist. Nur gesetzt, falls der Typ des Stundenplans `Lecturer` ist. |
| `room`     | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-room) | Raum, für den der Stundenplan ist. Nur gesetzt, falls der Typ des Stundenplans `Room` ist. |
| `student`  | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-schedules-person) | Student, für die der Stundenplan ist. Nur gesetzt, falls der Typ des Stundenplans `Student` ist. |
| `type`     | String                                                       | Typ des Stundenplans. Gültige Werte sind: `Class` (Stundenplan einer Schulklasse), `Course` (Stundenplan eines Kurses), `Lecutrer` (Stundenplan eines Dozenten), `Room` (Stundenplan eines Raums), `Student` (Stundenplan eines Studenten) |

|      | Beispiele für Stundenpläne sind im Abschnitt [Stundenplan-Ressourcen](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#resources-schedules) zu finden. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

##### Slot

Repräsentiert einen Zeitschlitz (“Lektion”) im Zeitraster des Stundenplans.

| Name        | Typ      | Beschreibung                                                 |
| ----------- | -------- | ------------------------------------------------------------ |
| `endTime`   | DateTime | Zeit, zu der die Lektion endet, nach ISO 8601. **Beispiel-Wert**: `2012-05-15T08:45:00` |
| `startTime` | DateTime | Zeit, zu der die Lektion beginnt, nach ISO 8601. **Beispiel-Wert**: `2012-05-15T08:00:00` |

Example 46. Slot-Objekt in JSON

```json
{
    "endTime": "2012-05-14T17:35:00",
    "startTime": "2012-05-14T16:50:00"
}
```

Example 47. Slot-Objekt in XML

```xml
<slot>
    <endTime>2012-05-14T08:45:00</endTime>
    <startTime>2012-05-14T08:00:00</startTime>
</slot>
```

### Mensa

#### CalendarWeek

Repräsentiert eine Kalenderwoche eines spezifischen Jahres.

| Name   | Typ     | Beschreibung                                                 |
| ------ | ------- | ------------------------------------------------------------ |
| `week` | Integer | Wochennummer der [Kalenderwoche nach ISO 8601](https://de.wikipedia.org/w/index.php?title=Woche&oldid=119565740#Z.C3.A4hlweise_nach_ISO_8601). **Beispiel-Wert**: `5` |
| `year` | Integer | Jahreszahl des Jahres, in dem die Kalenderwoche liegt. **Beispiel-Wert**: `2013` |

Example 48. CalendarWeek-Objekt in JSON

```json
{
    "week": 8,
    "year": 2013
}
```

Example 49. CalendarWeek-Objekt in XML

```xml
<calendarWeek>
  <week>8</week>
  <year>2013</year>
</calendarWeek>
```

#### Dish

Repräsentiert ein Gericht, das an einem spezifischen Tag im Angebot ist.

| Name               | Typ                                                          | Beschreibung                                                 |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `externalPrice`    | Decimal                                                      | Preis, den Personen für das Gericht bezahlen müssen, die nicht Mitglieder bzw. Partner der ZHAW sind. **Beispiel-Wert**: `8.00` |
| `id`               | Integer                                                      | Eindeutige Identifikationsnummer des Gerichts (bzw. des Datensatzes). Wird durch den Server verwaltet. **Beispiel-Wert**: `3` |
| `internalPrice`    | Decimal                                                      | Preis, den Mitglieder der ZHAW für das Gericht bezahlen müssen. **Beispiel-Wert**: `6.50` |
| `label`            | String                                                       | Bezeichnet die Art des Gerichts, z.B. "Tagesmenü" oder "Budget-Menü". **Beispiel-Wert**: `Tagesmenü` |
| `name`             | String                                                       | Name des Gerichts. **Beispiel-Wert**: `Omelette`             |
| `priceForPartners` | Decimal                                                      | Preis, den Partner der ZHAW für das Gericht bezahlen müssen. **Beispiel-Wert**: `7.50` |
| `sideDishes`       | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-sidedish) | Liste der Beilagen zum Gericht (kann leer sein).             |
| `version`          | String                                                       | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Gerichts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC/0=` |

Example 50. Dish-Objekt in JSON

```json
{
    "externalPrice": 10.0,
    "id": 18,
    "internalPrice": 6.0,
    "label": "Vegimenu",
    "name": "\"Tortiglioni del Patrone\"",
    "priceForPartners": 7.0,
    "sideDishes": [
        {
            "id": 35,
            "name": "mit getrockneten Tomaten",
            "version": "AAAAAAAADAk="
        },
        {
            "id": 36,
            "name": "und Champignons",
            "version": "AAAAAAAADAo="
        }
    ],
    "version": "AAAAAAAAC/c="
}
```

Example 51. Dish-Objekt in XML

```xml
<dish>
  <externalPrice>11.0000</externalPrice>
  <id>22</id>
  <internalPrice>7.0000</internalPrice>
  <label>Tagesmenu</label>
  <name>Rindsbraten (CH)</name>
  <priceForPartners>8.0000</priceForPartners>
  <sideDishes>
    <sideDish>
      <id>43</id>
      <name>an Portweinjus</name>
      <version>AAAAAAAADBE=</version>
    </sideDish>
    <sideDish>
      <id>44</id>
      <name>Griessgnocchi</name>
      <version>AAAAAAAADBI=</version>
    </sideDish>
    <sideDish>
      <id>45</id>
      <name>R&#xFC;ebli</name>
      <version>AAAAAAAADBM=</version>
    </sideDish>
  </sideDishes>
  <version>AAAAAAAAC/0=</version>
</dish>
```

#### GastronomicFacility

Repräsentiert eine Mensa respektive Cafeteria der ZHAW.

| Name                 | Typ                                                          | Beschreibung                                                 |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `holidays`           | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-holiday) | Liste der Feiertage, an denen die Mensa respektive Cafeteria geschlossen bleibt. Kann leer sein. |
| `id`                 | Integer                                                      | Eindeutige Identifikationsnummer der Mensa/Cafeteria (bzw. des Datensatzes). Wird durch den Server verwaltet. **Beispiel-Wert**: `83` |
| `location`           | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-location) | Ort, an dem sich die Mensa/Cafeteria befindet.               |
| `name`               | String                                                       | Name der Mensa/Cafeteria. **Beispiel-Wert**: `Tössfeld`      |
| `serviceTimePeriods` | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetimeperiod) | Liste mit Servicezeiten der Mensa/Cafeteria (d.h. Öffnungs- und Mittagszeiten). Kann leer sein. |
| `type`               | String                                                       | Typ des Objekts. Definiert, ob es sich um eine Mensa (`Canteen`) oder eine Cafeteria (`Cafeteria`) handelt. **Beispiel-Wert**: `Canteen` |
| `version`            | String                                                       | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC7o=` |

|      | Ist die Liste der Servicezeiten leer oder sind keine Servicezeiten für  den benötigten Zeitraum hinterlegt, bedeutet das nicht, dass die  Mensa/Cafeteria geschlossen ist. Eine Mensa/Cafeteria ist erst dann  geschlossen, wenn die Servicezeiten hinterlegt, der Eintrag für den  gewünschten Tag aber fehlt. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

|      | Beispiele für Mensa/Cafeteria-Objekte sind in der [Ressourcen-Dokumentation](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#resources-catering-facilities) zu finden. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

#### Holiday

Repräsentiert einen Feiertag, an dem eine Mensa/Cafeteria geschlossen ist.

| Name       | Typ      | Beschreibung                                                 |
| ---------- | -------- | ------------------------------------------------------------ |
| `endsAt`   | DateTime | Zeitpunkt, zu dem der Feiertag endet, nach [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Die Dauer eines Feiertags ist definiert als `startsAt <= holiday < endsAt`. **Beispiel-Wert**: `2013-05-02T00:00:00+02:00` |
| `id`       | Integer  | Eindeutige Identifikationsnummer des Feiertags (bzw. des Datensatzes). Wird durch den Server verwaltet. **Beispiel-Wert**: `19` |
| `name`     | String   | Name des Feiertags. **Beispiel-Wert**: `Weihnachten`         |
| `startsAt` | DateTime | Zeitpunkt, zu dem der Feiertag beginnt, nach [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Die Dauer eines Feiertags ist definiert als `startsAt <= holiday < endsAt`. **Beispiel-Wert**: `2013-05-01T00:00:00+02:00` |
| `version`  | String   | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC7w=` |

Example 52. Holiday-Objekt in JSON

```json
{
    "endsAt": "2013-05-02T00:00:00+02:00",
    "id": 1,
    "name": "1. Mai",
    "startsAt": "2013-05-01T00:00:00+02:00",
    "version": "AAAAAAAAC7w="
}
```

Example 53. Holiday-Objekt in XML

```xml
<holiday>
  <endsAt>2013-05-10T00:00:00+02:00</endsAt>
  <id>2</id>
  <name>Auffahrt</name>
  <startsAt>2013-05-08T16:00:00+02:00</startsAt>
  <version>AAAAAAAAD6E=</version>
</holiday>
```

#### Location

Repräsentiert einen Ort, an dem sich eine Mensa/Cafeteria der ZHAW befindet.

| Name      | Typ     | Beschreibung                                                 |
| --------- | ------- | ------------------------------------------------------------ |
| `id`      | Integer | Eindeutige Identifikationsnummer des Orts (bzw. des Datensatzes). Wird durch den Server verwaltet. **Beispiel-Wert**: `201` |
| `name`    | String  | Name des Orts. **Beispiel-Wert**: `Winterthur`               |
| `version` | String  | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAB9E=` |

Example 54. Location-Objekt in JSON

```json
{
    "id": 1,
    "name": "Winterthur",
    "version": "AAAAAAAAB9E="
}
```

Example 55. Location-Objekt in XML

```xml
<location>
  <id>1</id>
  <name>Winterthur</name>
  <version>AAAAAAAAB9E=</version>
</location>
```

#### Menu

Repräsentiert ein Menü, d.h. die Menge der Gerichte, die an einem bestimmten Tag angeboten werden.

| Name        | Typ                                                          | Beschreibung                                                 |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `dishes`    | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-dish) | Liste der Gerichte, die Teil des Menüs sind.                 |
| `id`        | Integer                                                      | Nummer, die den den Datensatz eindeutig identifiziert. Wird vom Server verwaltet. **Beispiel-Wert**: `9` |
| `offeredOn` | LocalDate                                                    | Datum des Tages, an dem das Menü angeboten wird, in der lokalen Zeitzone der Mensa/Cafeteria nach [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). **Beispiel-Wert**: `2013-01-13` |
| `version`   | String                                                       | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC/Q=` |

Example 56. Menu-Objekt in JSON

```json
{
    "dishes": [
        {
            "externalPrice": 9.5,
            "id": 17,
            "internalPrice": 5.5,
            "label": "Budget Menu (Nur im Technikum)",
            "name": "Kartoffelgratin",
            "priceForPartners": 6.5,
            "sideDishes": [
                {
                    "id": 34,
                    "name": "mit Lauch und K\u00e4se",
                    "version": "AAAAAAAADAg="
                }
            ],
            "version": "AAAAAAAAC/Y="
        }
    ],
    "id": 6,
    "offeredOn": "2013-02-19T00:00:00+01:00",
    "version": "AAAAAAAAC/Q="
}
```

Example 57. Menu-Objekt in XML

```xml
<menu>
  <dishes>
    <dish>
      <externalPrice>9.5000</externalPrice>
      <id>17</id>
      <internalPrice>5.5000</internalPrice>
      <label>Budget Menu (Nur im Technikum)</label>
      <name>Kartoffelgratin</name>
      <priceForPartners>6.5000</priceForPartners>
      <sideDishes>
        <sideDish>
          <id>34</id>
          <name>mit Lauch und K&#xE4;se</name>
          <version>AAAAAAAADAg=</version>
        </sideDish>
      </sideDishes>
      <version>AAAAAAAAC/Y=</version>
    </dish>
  </dishes>
  <id>6</id>
  <offeredOn>2013-02-19T00:00:00+01:00</offeredOn>
  <version>AAAAAAAAC/Q=</version>
</menu>
```

#### MenuPlan

Repräsentiert einen Menüplan für eine bestimmte Kalenderwoche.

| Name                     | Typ                                                          | Beschreibung                                                 |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `calendarWeek`           | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-calendarweek) | Kalenderwoche, für die der Menüplan gültig ist.              |
| `gastronomicFacilityIds` | Liste von Integer                                            | Enthält die Liste der IDs der Mensen/Cafeterias, für die der Menüplan gültig ist. Es handelt sich um die Werte aus dem Feld `id` des Objekts [GastronomicFacility](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-gastronomicfacility). |
| `id`                     | Integer                                                      | Nummer, die den den Datensatz eindeutig identifiziert. Wird vom Server verwaltet. **Beispiel-Wert**: `97` |
| `menus`                  | Liste von [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-menu) | Liste der Menüs, die der Menüplan umfasst.                   |
| `version`                | String                                                       | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC/Q=` |

|      | Beispiele für MenuPlan-Objekte sind in der [Ressourcen-Dokumentation](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#resources-catering-menuplanbyyearandweek) zu finden. |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

#### ServiceTime

Repräsentiert eine Kalenderwoche eines spezifischen Jahres.

| Name    | Typ       | Beschreibung                                                 |
| ------- | --------- | ------------------------------------------------------------ |
| `from`  | LocalTime | Zeitpunkt,  ab dem die Mensa/Cafeteria offen ist bzw. Mittagessen erhältlich ist,  in der lokalen Zeitzone der Mensa/Cafeteria. Die Dauer ist definiert als  `from <= ServiceTime < until`. **Beispiel-Wert**: `09:45` |
| `type`  | String    | Art der Servicezeit, entweder Öffnungszeit (`OpeningTime`) oder Mittagszeit (`LunchTime`). **Beispiel-Wert**: `OpeningTime` |
| `until` | LocalTime | Zeitpunkt,  bis zu dem die Mensa/Cafeteria offen ist bzw. Mittagessen erhältlich  ist, in der lokalen Zeitzone der Mensa/Cafeteria. Die Dauer ist  definiert als `from <= ServiceTime < until`. **Beispiel-Wert**: `12:15` |

Example 58. ServiceTime-Objekt in JSON

```json
{
    "from": "07:00",
    "type": "OpeningTime",
    "until": "20:00"
}
```

Example 59. ServiceTime-Objekt in XML

```xml
<thursday>
  <from>11:00</from>
  <type>LunchTime</type>
  <until>13:45</until>
</thursday>
```

#### ServiceTimePeriod

Beinhaltet die Servicezeiten (wie Öffnungszeiten und Mittagszeiten) für einen gewissen Zeitraum.

| Name              | Typ                                                          | Beschreibung                                                 |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `endsOn`          | LocalDate                                                    | Tag, bis zu dem die Servicezeiten gültig sind, nach [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Die Gültigkeitsdauer der Servicezeiten ist definiert als `startsOn <= ServiceTimePeriod <= endsOn`. **Beispiel-Wert**: `2013-06-02T00:00:00+02:00` |
| `id`              | Integer                                                      | Nummer, die den den Datensatz eindeutig identifiziert. Wird vom Server verwaltet. **Beispiel-Wert**: `14` |
| `lunchTimePlan`   | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetimeplan) | Mittagszeiten für die aktuelle Periode. Wird kein Mittagessen angeboten, fehlen die Zeitangaben. |
| `openingTimePlan` | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetimeplan) | Öffnungszeiten für die aktuelle Periode. Fehlen die Zeitangaben, ist die Mensa/Cafeteria geschlossen. |
| `startsOn`        | LocalDate                                                    | Tag, ab dem die Servicezeiten gültig sind, nach [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Die Gültigkeitsdauer der Servicezeiten ist definiert als `startsOn <= ServiceTimePeriod <= endsOn`. **Beispiel-Wert**: `2013-02-18T00:00:00+01:00` |
| `version`         | String                                                       | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC74=` |

Example 60. ServiceTimePeriod-Objekt in JSON

```json
{
    "endsOn": "2013-06-02T00:00:00+02:00",
    "id": 2,
    "lunchTimePlan": {
        "type": "LunchTimePlan",
        "wednesday": {
            "from": "11:00",
            "type": "LunchTime",
            "until": "13:45"
        }
    },
    "openingTimePlan": {
        "type": "OpeningTimePlan",
        "wednesday": {
            "from": "07:00",
            "type": "OpeningTime",
            "until": "20:00"
        }
    },
    "startsOn": "2013-02-18T00:00:00+01:00",
    "version": "AAAAAAAAC74="
}
```

Example 61. ServiceTimePeriod-Objekt in XML

```xml
<serviceTimePeriod>
  <endsOn>2013-06-02T00:00:00+02:00</endsOn>
  <id>2</id>
  <lunchTimePlan>
    <monday>
      <from>11:00</from>
      <type>LunchTime</type>
      <until>13:45</until>
    </monday>
    <type>LunchTimePlan</type>
  </lunchTimePlan>
  <openingTimePlan>
    <monday>
      <from>07:00</from>
      <type>OpeningTime</type>
      <until>20:00</until>
    </monday>
    <type>OpeningTimePlan</type>
  </openingTimePlan>
  <startsOn>2013-02-18T00:00:00+01:00</startsOn>
  <version>AAAAAAAAC74=</version>
</serviceTimePeriod>
```

#### ServiceTimePlan

Repräsentiert einen Servicezeitenplan.

| Name        | Typ                                                          | Beschreibung                                                 |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `friday`    | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Freitag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `monday`    | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Montag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `saturday`  | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Samstag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `sunday`    | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Sonntag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `thursday`  | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Donnerstag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `tuesday`   | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Dienstag. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |
| `type`      | String                                                       | Art des Servicezeitenplan, entweder Öffnungszeiten (bei Typ `OpeningTimePlan`) oder Mittagszeiten (bei Typ `LunchTimePlan`). **Beispiel-Wert**: `LunchTimePlan` |
| `wednesday` | [Object](file:///Users/juianvisser/Documents/ZHAW/git/zhawo/docs/campusinfo_api_doku.html#object-catering-servicetime) | Servicezeit für Mittwoch. Geschlossen (bei Typ `OpeningTimePlan`) bzw. kein Mittagessen (bei Typ `LunchTimePlan`), wenn Werte fehlen. |

Example 62. ServiceTimePlan-Objekt in JSON

```json
{
    "type": "LunchTimePlan",
    "wednesday": {
        "from": "11:00",
        "type": "LunchTime",
        "until": "13:45"
    }
}
```

Example 63. ServiceTimePlan-Objekt in XML

```xml
<?xml version="1.0"?>
<lunchTimePlan>
  <monday>
    <from>11:00</from>
    <type>LunchTime</type>
    <until>13:45</until>
  </monday>
  <type>LunchTimePlan</type>
</lunchTimePlan>
```

#### SideDish

Repräsentiert eine Beilage zu einem Gericht.

| Name      | Typ     | Beschreibung                                                 |
| --------- | ------- | ------------------------------------------------------------ |
| `id`      | Integer | Eindeutige Identifikationsnummer der Beilage (bzw. des Datensatzes). Wird durch den Server verwaltet. **Beispiel-Wert**: `31` |
| `name`    | String  | Name der Beilage. **Beispiel-Wert**: `Bohnen`                |
| `version` | String  | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter  Byte-Array, der die Version des Objekts (also des Datensatzes)  eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAADAY=` |

Example 64. SideDish-Objekt in JSON

```json
{
    "id": 32,
    "name": "Trockenreis",
    "version": "AAAAAAAADAY="
}
```

Example 65. SideDish-Objekt in XML

```xml
<sideDish>
  <id>44</id>
  <name>Griessgnocchi</name>
  <version>AAAAAAAADBI=</version>
</sideDish>
```

### Feeds

#### Feed

Repräsentiert einen Feed.

| Name                | Typ       | Beschreibung                                                 |
| ------------------- | --------- | ------------------------------------------------------------ |
| `cacheExpiresAfter` | LocalTime | Zeit, nach der der zwischengespeicherte Feed abläuft und erneut abgerufen wird, in Stunden und Minuten. **Beispiel-Wert**: `01:00` |
| `identifier`        | String    | Zeichenkette, die den Feed eindeutig identifiziert. **Beispiel-Wert**: `zhaw-news` |
| `name`              | String    | Name des Feeds. **Beispiel-Wert**: `News School of Engineering` |
| `type`              | String    | Typ des Feeds, entweder `EventFeed` oder `NewsFeed`. **Beispiel-Wert**: `EventFeed` |
| `url`               | String    | Quell-Url des Feeds. **Beispiel-Wert**: `http://example.com/feed` |
| `version`           | String    | [Base64](http://de.wikipedia.org/wiki/Base64)-codierter Byte-Array, der die Version des Datensatzes eindeutig identifiziert. Wird durch den Server verwaltet. **Beispiel-Wert**: `AAAAAAAAC/0=` |

Example 66. Feed-Objekt in JSON

```json
{
    "cacheExpiresAfter": "01:00",
    "identifier": "soe-events",
    "name": "Veranstaltungen School of Engineering",
    "type": "EventFeed",
    "url": "http://www.engineering.zhaw.ch/de/engineering/rss-veranstaltungen-engineering.html",
    "version": "AAAAAAAAE40="
}
```

Example 67. Feed-Objekt in XML

```xml
<feed>
  <cacheExpiresAfter>01:00</cacheExpiresAfter>
  <identifier>soe-news</identifier>
  <name>News School of Engineering</name>
  <type>NewsFeed</type>
  <url>http://www.engineering.zhaw.ch/de/engineering/rss-school-of-engineering.html</url>
  <version>AAAAAAAAE4w=</version>
</feed>
```

 Last updated 2018-04-12 16:02:55 CEST 