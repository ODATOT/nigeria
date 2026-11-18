(function () {
  "use strict";

  function ctx(day, type, id, item) {
    return { day: day, type: type, id: id, title: item.title, artifact: item.artifact, brief: item.pbl.brief, persona: item.pbl.scenario.persona, situation: item.pbl.scenario.situation, work: item.pbl.work, done: item.pbl.done, issue: item.issue || "" };
  }
  function bullets(values, prefix) { return values.map(function (v) { return (prefix || "- ") + v; }).join("\n"); }
  function csvCell(value) { var s = String(value == null ? "" : value); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCsv(rows) { return rows.map(function (row) { return row.map(csvCell).join(","); }).join("\n") + "\n"; }

  function exact(name) {
    if (name === "ai-api-spec.yaml") return [
      "openapi: 3.0.3", "info:", "  title: Streamly AI Generated API", "  version: 0.1.0-draft", "paths:",
      "  /videos:", "    post:", "      summary: Register video", "      requestBody:", "        required: true", "        content:", "          application/json:",
      "            schema:", "              type: object", "              required: [title, sourceUrl]", "              properties:", "                title: { type: string }", "                sourceUrl: { type: string }",
      "      responses:", "        '200': { description: Registered }", "        '400': { description: Treats every failure as a bad request }",
      "  /payments/{paymentId}:", "    get:", "      summary: Get payment", "      responses:", "        '200': { description: Payment complete }",
      "# Task: the cancel, duplicate request, permission error, Pending and Idempotency contracts are missing."
    ].join("\n") + "\n";
    if (name === "user-flow-cases.md") return [
      "# User Flow cases — for API tracing", "",
      "| Case | Actor | Action | Expected state | Action after failure |", "|---|---|---|---|---|",
      "| UF-01 | Creator | Register video | DRAFT created | Show Validation and keep input |",
      "| UF-02 | Creator | Cancel upload | Session discarded | Repeated cancel returns the same result |",
      "| UF-03 | Creator | Click register twice | 1 video created | Return Idempotency Key result |",
      "| UF-04 | Viewer | Play paid video | Return to the original video after login | Show purchase required |",
      "| UF-05 | Viewer | Request playback URL | Issue an expiring URL | If no permission, check purchase history |",
      "| UF-06 | Advertiser | Change budget | Return new budget and version | On conflict, show the latest value |",
      "| UF-07 | Admin | Block video | BLOCKED and audit Log | Forbidden if not enough permission |",
      "| UF-08 | Viewer | PG response delayed | Show PENDING | Allow only lookup/cancel, no re-approval |", "",
      "Check that ai-api-spec.yaml has the Endpoints, errors, states and Tests that support each Flow."
    ].join("\n") + "\n";
    return null;
  }

  function markdown(name, c) {
    var ai = /^ai[-_]/i.test(name);
    return [
      "# " + name, "", "> Day " + c.day + " · " + c.title + " · " + (ai ? "AI draft (not yet verified)" : "Starter material for learning"), "",
      "## Persona situation", "", c.situation, "", "## Problem to solve", "", c.brief, "",
      "## Current materials", "", "- Confirmed fact: each role has different goals and data responsibilities.", "- Policy to review: recovery actions after failure and operations responsibility",
      ai ? "- AI assumption: the normal flow is enough, so error handling is skipped." : "- Undecided: numeric limits and the approver", "",
      "## Student tasks", "", bullets(c.work), "", "## Done criteria", "", bullets(c.done, "- [ ] "), "",
      "## Evidence log", "", "| ID | Fact/Assumption/Question | Content | Evidence | Decision |", "|---|---|---|---|---|", "| E-01 | Fact |  |  |  |", "| E-02 | AI assumption |  |  |  |"
    ].join("\n") + "\n";
  }

  function csvContent(name) {
    if (/feature/i.test(name)) return toCsv([["feature_id","feature","actor","responsibility","owner_domain"],["F-01","Video upload","Creator","Register source video",""],["F-02","Change ad budget","Advertiser","Budget management",""],["F-03","Payment approval","Viewer","Approve amount",""]]);
    if (/persona|evidence/i.test(name)) return toCsv([["persona","source_quote","goal","behavior","data","status"],["Creator","Creators upload videos","Publish video","Upload·edit","videoId;status","CONFIRMED"],["Advertiser","","Run ads","Set budget","campaignId;budget","HYPOTHESIS"]]);
    if (/permission|role-resource/i.test(name)) return toCsv([["role","resource","action","ownership","tenant","expected"],["CREATOR","Video","UPDATE","owner","same","ALLOW"],["CREATOR","Video","UPDATE","other","same","DENY"],["ADVERTISER","Campaign","READ","owner","other","DENY"]]);
    if (/term/i.test(name)) return toCsv([["korean","english","code","meaning","allowed_transition"],["Approved","Approved","APPROVED","Allowed by the policy owner",""],["Confirmed","Confirmed","CONFIRMED","Cannot be changed",""],["Completed","Completed","COMPLETED","Processing finished",""]]);
    if (/consumer|dependency|usage|inventory/i.test(name)) return toCsv([["consumer","owner","contract","usage","risk","migration"],["Web Checkout","Frontend","price","Show amount","HIGH",""],["Settlement Batch","Finance","paymentStatus","Settlement filter","HIGH",""],["Ops Report","Operations","userId","Operations metrics","MEDIUM",""]]);
    if (/metric|event|refund/i.test(name)) return toCsv([["event_id","user_id","event_type","occurred_at","amount","status","duplicate_of"],["evt-001","viewer-1","checkout_started","2026-09-28T01:00:00Z","15000","VALID",""],["evt-002","viewer-1","payment_completed","2026-09-28T01:01:00Z","15000","VALID",""],["evt-003","viewer-1","payment_completed","2026-09-28T01:01:01Z","15000","DUPLICATE","evt-002"]]);
    return toCsv([["id","category","input","expected","actual","evidence","decision"],["CASE-01","normal","sample-a","Normal handling","","",""],["CASE-02","boundary","sample-b","Edge check","","",""],["CASE-03","failure","sample-c","Recovery action","","",""]]);
  }

  function jsonContent(name, c) {
    var value;
    if (/impression|campaign/i.test(name)) value = { campaignId:"cam-101", viewerId:"viewer-21", occurredAt:"2026-09-28T01:02:03Z", exposuresLast24h:3, remainingBudget:1000, impressionCost:100, expected:"BLOCK" };
    else if (/failure|duplicate|pg-event/i.test(name)) value = { traceId:"trace-001", paymentId:"pay-101", events:[{id:"evt-1",type:"PAYMENT_REQUESTED"},{id:"evt-2",type:"PG_TIMEOUT"},{id:"evt-2-copy",type:"PAYMENT_RETRY_REQUESTED",warning:"duplicate charge risk"}] };
    else if (/slo-dashboard/i.test(name)) value = { service:"streamly", release:"rc-10", thresholds:{errorRate:0.01,p95LatencyMs:800,paymentFailureRate:0.03}, observed:null };
    else value = { day:c.day, title:c.title, records:[{id:"sample-1",status:"CONFIRMED",value:"Normal case"},{id:"sample-2",status:"UNVERIFIED",value:"AI assumption"},{id:"sample-3",status:"FAILED",value:"Needs recovery"}], todo:c.work };
    return JSON.stringify(value, null, 2) + "\n";
  }

  function yamlContent(name, c) {
    return exact(name) || ["openapi: 3.0.3","info:","  title: Day " + c.day + " " + c.title,"  version: 0.1.0","paths:","  /resources/{resourceId}:","    get:","      responses:","        '200': { description: Success }","        '404': { description: Not found }","# TODO: Permission, Validation, Conflict, Idempotency, Error Schema"].join("\n") + "\n";
  }
  function mermaid(name) {
    if (/sequence|payment|iot|sync/i.test(name)) return ["sequenceDiagram","  actor User","  participant Client","  participant API","  participant Domain","  participant DB","  User->>Client: Request task","  Client->>API: POST /resource","  API->>Domain: command","  Domain->>DB: save","  DB-->>Domain: result","  Domain-->>Client: response","  %% TODO: Timeout, Retry, permission failure, compensation flow"].join("\n") + "\n";
    return ["flowchart LR","  User --> Client","  Client --> DomainA","  DomainA -->|Event| DomainB","  DomainB --> Store[(Data Store)]","  DomainA -. ownership conflict .-> Store","  %% TODO: Owner, Consumer, recovery responsibility"].join("\n") + "\n";
  }
  function javascript(name, c) {
    if (/frequency-cap/i.test(name)) return "export function canExpose(history, now) {\n  // TODO: decide if it's fewer than 3 times in the last 24 hours, and block concurrent requests.\n  throw new Error('NOT_IMPLEMENTED');\n}\n";
    if (/selector/i.test(name)) return "export function selectCampaign(campaigns, context) {\n  // TODO: choose deterministically in the order ACTIVE → Budget → Target → Frequency.\n  return null;\n}\n";
    return "// Day " + c.day + " starter: " + c.title + "\nexport async function run(input, dependencies) {\n  if (!input) throw new Error('INPUT_REQUIRED');\n  // TODO: build the normal, edge and failure flows and recovery results.\n  return { status: 'NOT_IMPLEMENTED' };\n}\n";
  }
  function html(name, c) {
    return "<!doctype html>\n<html lang=\"ko\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>" + c.title + " Starter</title><style>body{font-family:sans-serif;max-width:720px;margin:40px auto}label{display:block;margin:12px 0}input,button{padding:10px;width:100%}.error{color:#A83A45}</style></head><body><main><h1>" + c.title + "</h1><p>" + c.brief + "</p><form><label>Email<input type=\"email\"></label><button>Continue</button><p class=\"error\" role=\"alert\"></p></form><!-- TODO: Loading, Empty, Error, Disabled, Success와 복구 화면 --></main></body></html>\n";
  }
  function logText() {
    return "2026-09-28T01:00:00.100Z INFO trace=tr-101 request_started\n2026-09-28T01:00:30.212Z WARN trace=tr-101 retry attempt=1 reason=UPSTREAM_TIMEOUT\n2026-09-28T01:00:30.220Z ERROR trace=tr-101 duplicate_side_effect resource=res-77\n2026-09-28T01:01:00.050Z ERROR trace=tr-102 access_denied user=user-b owner=user-a\n# TODO: reproduction conditions, root cause, user impact, fix evidence\n";
  }
  function content(name, c) {
    var special = exact(name); if (special) return special;
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "md") return markdown(name, c);
    if (ext === "csv") return csvContent(name);
    if (ext === "json") return jsonContent(name, c);
    if (ext === "yaml" || ext === "yml") return yamlContent(name, c);
    if (ext === "mmd") return mermaid(name);
    if (ext === "js") return javascript(name, c);
    if (ext === "html") return html(name, c);
    if (ext === "sql") return "-- AI order Schema\nCREATE TABLE products(product_id BIGINT PRIMARY KEY,current_price DECIMAL(12,2));\nCREATE TABLE order_items(order_id BIGINT,product_id BIGINT,quantity INT);\n-- Problem: there is no price Snapshot at order time. Write a Migration and check Query.\n";
    if (ext === "diff") return "diff --git a/contract.json b/contract.json\n--- a/contract.json\n+++ b/contract.json\n-  \"price\": 15000,\n+  \"price\": \"15000\",\n-  \"status\": \"PENDING\"\n+  \"state\": \"WAITING\"\n# TODO: impact on Consumers, Migration, backward compatibility, Rollback\n";
    if (ext === "har") return JSON.stringify({log:{version:"1.2",creator:{name:"ACE AI SW Startup Training PBL",version:"1.0"},entries:[{time:30005,request:{method:"GET",url:"https://example.local/api/videos"},response:{status:504,statusText:"Gateway Timeout"}}]}}, null, 2) + "\n";
    if (ext === "log" || ext === "txt") return logText();
    return markdown(name + ".md", c);
  }

  function folder(name, c) {
    var root = name.replace(/\/$/, "");
    return [
      { name:root + "/README.md", content:markdown("README.md", c) },
      { name:root + "/package.json", content:JSON.stringify({name:root.replace(/[^a-z0-9-]/gi,"-").toLowerCase(),private:true,type:"module",scripts:{test:"node --test"}},null,2)+"\n" },
      { name:root + "/src/index.js", content:javascript(root + ".js", c) },
      { name:root + "/test/starter.test.js", content:"import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('normal, edge and failure conditions',()=>{ assert.equal(true,false,'Complete this test'); });\n" }
    ];
  }
  function resolve(day, type, id, name, item) { var c = ctx(day,type,id,item); return /\/$/.test(name) ? folder(name,c) : [{name:name,content:content(name,c)}]; }
  function describe(name) {
    if (/\/$/.test(name)) return "ZIP Starter Pack with README, Source and Tests";
    if (/^ai[-_]/i.test(name)) return "Unverified AI draft with errors, gaps and assumptions";
    var ext=(name.split(".").pop()||"").toUpperCase();
    return ({MD:"Policies, cases and writing templates",CSV:"Sample data for analysis",JSON:"Structured data for running and testing",YAML:"API Contract draft",MMD:"Mermaid diagram draft",JS:"Unfinished implementation Starter",HTML:"Screen Prototype for practice",SQL:"Database Schema for reproduction",DIFF:"Diff for change-impact analysis",HAR:"Browser Network log",LOG:"Failure reproduction Log",TXT:"Environment & settings record"})[ext] || ext + " Starter materials";
  }

  window.LMS_INPUT_FILES_CORE = { resolve:resolve, describe:describe };
})();

(function () {
  "use strict";
  var core = window.LMS_INPUT_FILES_CORE;
  if (!core) return;

  var crcTable = (function () {
    var table = [];
    for (var n = 0; n < 256; n += 1) {
      var c = n;
      for (var k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();
  function crc32(bytes) {
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i += 1) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function u16(view, offset, value) { view.setUint16(offset, value, true); }
  function u32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
  function zip(entries) {
    var encoder = new TextEncoder();
    var files = entries.map(function (entry) {
      var fileName = encoder.encode(entry.name);
      var data = encoder.encode(entry.content);
      return { name:fileName, data:data, crc:crc32(data) };
    });
    var localSize = files.reduce(function (sum, file) { return sum + 30 + file.name.length + file.data.length; }, 0);
    var centralSize = files.reduce(function (sum, file) { return sum + 46 + file.name.length; }, 0);
    var output = new Uint8Array(localSize + centralSize + 22);
    var view = new DataView(output.buffer);
    var offset = 0;
    var records = [];
    files.forEach(function (file) {
      var start = offset;
      u32(view,offset,0x04034b50); u16(view,offset+4,20); u16(view,offset+6,0x0800); u16(view,offset+8,0);
      u16(view,offset+10,0); u16(view,offset+12,0); u32(view,offset+14,file.crc); u32(view,offset+18,file.data.length);
      u32(view,offset+22,file.data.length); u16(view,offset+26,file.name.length); u16(view,offset+28,0);
      output.set(file.name,offset+30); output.set(file.data,offset+30+file.name.length);
      offset += 30 + file.name.length + file.data.length;
      records.push({file:file,start:start});
    });
    var centralStart = offset;
    records.forEach(function (record) {
      var file = record.file;
      u32(view,offset,0x02014b50); u16(view,offset+4,20); u16(view,offset+6,20); u16(view,offset+8,0x0800); u16(view,offset+10,0);
      u16(view,offset+12,0); u16(view,offset+14,0); u32(view,offset+16,file.crc); u32(view,offset+20,file.data.length); u32(view,offset+24,file.data.length);
      u16(view,offset+28,file.name.length); u16(view,offset+30,0); u16(view,offset+32,0); u16(view,offset+34,0); u16(view,offset+36,0);
      u32(view,offset+38,0); u32(view,offset+42,record.start); output.set(file.name,offset+46); offset += 46 + file.name.length;
    });
    u32(view,offset,0x06054b50); u16(view,offset+4,0); u16(view,offset+6,0); u16(view,offset+8,files.length); u16(view,offset+10,files.length);
    u32(view,offset+12,offset-centralStart); u32(view,offset+16,centralStart); u16(view,offset+20,0);
    return output;
  }
  function save(blob, name) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function download(day,type,id,name,item) {
    var entries = core.resolve(day,type,id,name,item);
    if (/\/$/.test(name)) save(new Blob([zip(entries)],{type:"application/zip"}),name.replace(/\/$/,"")+".zip");
    else save(new Blob([entries[0].content],{type:"text/plain;charset=utf-8"}),name.split("/").pop());
  }
  function downloadAll(day,type,id,item) {
    var manifest = [
      "# START HERE — Day " + day + " " + item.title,
      "",
      "## Persona situation",
      "",
      item.pbl.scenario.situation,
      "",
      "## Materials provided",
      "",
      item.pbl.inputs.map(function (name) { return "- " + name + " — " + core.describe(name); }).join("\n"),
      "",
      "## Steps",
      "",
      item.pbl.work.map(function (work,index) { return (index+1) + ". " + work; }).join("\n"),
      "",
      "## Note",
      "",
      "- Files starting with ai- or ai_ are unverified AI drafts.",
      "- Don't fill blanks with guesses — sort them into facts, assumptions and questions.",
      "- Keep the original files and submit your edited version with a Diff."
    ].join("\n");
    var entries = [{name:"START_HERE.md",content:manifest+"\n"}];
    item.pbl.inputs.forEach(function (name) { entries = entries.concat(core.resolve(day,type,id,name,item)); });
    save(new Blob([zip(entries)],{type:"application/zip"}),"day"+day+"-"+type+id+"-starter-files.zip");
  }
  function render(day,type,id,item,escapeHtml) {
    return '<div class="input-download-head"><p>Download the files and save them in the same work folder. The AI drafts are not answers — they are for finding errors and gaps.</p><button type="button" class="button primary input-download-all">Download all materials (ZIP)</button></div>' +
      '<div class="input-download-list">' + item.pbl.inputs.map(function (name,index) {
        return '<div class="input-download-row"><div><code>'+escapeHtml(name)+'</code><span>'+escapeHtml(core.describe(name))+'</span></div><button type="button" class="button input-download-one" data-input-index="'+index+'">'+(/\/$/.test(name)?"Download ZIP":"Download file")+'</button></div>';
      }).join("") + '</div>';
  }
  function bind(root,day,type,id,item) {
    root.querySelector(".input-download-all").addEventListener("click",function(){downloadAll(day,type,id,item);});
    root.querySelectorAll(".input-download-one").forEach(function(button){
      button.addEventListener("click",function(){download(day,type,id,item.pbl.inputs[Number(button.dataset.inputIndex)],item);});
    });
  }
  window.LMS_INPUT_FILES = { resolve:core.resolve, describe:core.describe, zip:zip, render:render, bind:bind };
})();
