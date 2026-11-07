// One script for the whole site. Each module looks for its own elements and does
// nothing on pages that don't have them, so one failing can't stop the rest.
import nav from "./modules/nav.js";
import tease from "./modules/tease.js";
import ticker from "./modules/ticker.js";
import make from "./modules/make.js";
import stack from "./modules/stack.js";
import caseStory from "./modules/caseStory.js";
import serviceWidgets from "./modules/serviceWidgets.js";
import processScene from "./modules/process.js";
import start from "./modules/start.js";
import ventures from "./modules/ventures.js";
import record from "./modules/record.js";
import contact from "./modules/contact.js";

[nav, tease, ticker, make, stack, caseStory, serviceWidgets, processScene, start, ventures, record, contact]
  .forEach(function(init){
    try { init(); } catch (e) { console.error(e); }
  });
