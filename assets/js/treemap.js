import { setupSvg, setupTreemap } from "/detel-book/assets/js/treemap_module.js";

const helpText = `
Welcome to the Learning Goals Widget <br/> <br/>
This tool helps you reflect on the learned topics 
and keeps track of your progress.
The topics are on the left, and the learning goals 
are on the right. Each of these goals has a per cent near it,
representing your progress so far. <br/>
You can change this value by clicking on the topic or 
the learning goal and then moving the slider to the 
desired position. On the right side of each topic is an 
average of the progress you made on the learning goals. <br/> <br/>
Using a screen-reader, you can navigate through the 
document with the Tab key. By pressing enter, you can expand the topics.
When an action for the keyboard is available, it will be announced.
We optimized this tool for Google Chrome and its extension 
called Screen Reader. For an optimal experience, we suggest you use those. <br/>
Under the accessibility icon, you can find two buttons 
to change the font size. If you would like to adjust the zoom, 
you can press Ctrl and + or Ctrl and -. <br/>
Use the third icon to change the colours of the widget. <br/>
If you are colourblind, you can find some colour schemes 
with a dark blue outline. These have high contrast and 
should be suitable for you. <br/> <br/>
We wish you a happy learning experience!`;

const taxonomyCont = JSON.parse(`
{
  "name": "Literature Review",
  "children": [{
    "name": "Literature review",
    "children": [{
      "name": "You are able to understand the role of the literature review in academic research."
    }, {
      "name": "You are able to differentiate between literature review and systematic literature review."
    }]
  }, {
    "name": "Systematic Literature review",
    "children": [{
      "name": "You are able to learn and explain what a systematic review is."
    }, {
      "name": "You are able to learn and explain what a primary study is."
    }, {
      "name": "You are able to learn and explain what a secondary study is."
    }, {
      "name": "You are able to learn and explain what a systematic review protocol is."
    }]
  }, {
    "name": "Systematic Literature review process",
    "children": [{
      "name": "You are able to identify the phases involved in conducting a systematic literature review."
    }, {
      "name": "You are able to understand the role of the research questions in a systematic literature review."
    }, {
      "name": "You are able to identify the inclusion and exclusion criteria."
    }, {
      "name": "You are able to learn and define keywords to search literature."
    }, {
      "name": "You are able to learn how to conduct the search."
    }, {
      "name": "You are able to learn how to analyse the literature."
    }, {
      "name": "You are able to learn how to report the systematic literature review."
    }]
  }]
}
`);
/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const treemapID = "treemap-detel";
const localStorageKey = "treemapProgress";

const generateLocalStorageEntry = () => {
  const obj = {};
  obj[treemapID] = {};
  taxonomyCont.children.forEach((topic) => {
    topic.children.forEach((learningGoal) => {
      const name = topic.name + "@" + learningGoal.name;
      const hash = hashCode(name);
      obj[treemapID][hash] = 0;
    });
  });
  localStorage.setItem(localStorageKey, JSON.stringify(obj));
  return obj;
};

const getProgress = () => {
  let progress = localStorage.getItem(localStorageKey);
  if (progress === null) {
    progress = generateLocalStorageEntry();
  } else {
    progress = JSON.parse(progress);
  }

  taxonomyCont.children.forEach((topic) => {
    topic.children.forEach((learningGoal) => {
      const name = topic.name + "@" + learningGoal.name;
      const hash = hashCode(name);
      learningGoal.pro = progress[treemapID][hash];
    });
  });
};

const saveProgress = (_, object, pro) => {
  const name = object.parent.data.name + "@" + object.data.name;
  const hash = hashCode(name);
  let progress = localStorage.getItem(localStorageKey);
  if (progress === null) {
    progress = generateLocalStorageEntry();
  } else {
    progress = JSON.parse(progress);
  }
  progress[treemapID][hash] = parseFloat(pro);
  localStorage.setItem(localStorageKey, JSON.stringify(progress));
};

const retrieveProgress = () => {
  let progress = localStorage.getItem(localStorageKey);
  if (progress === null) {
    progress = generateLocalStorageEntry();
  } else {
    progress = JSON.parse(progress);
  }

  let isUndef = false;
  taxonomyCont.children.forEach((topic) => {
    topic.children.forEach((learningGoal) => {
      const name = topic.name + "@" + learningGoal.name;
      const hash = hashCode(name);
      if (progress[treemapID][hash] === undefined) {
        isUndef = true;
      }
      learningGoal.pro = progress[treemapID][hash];
    });
  });
  if (isUndef) {
    localStorage.removeItem(localStorageKey);
    retrieveProgress();
  }
};

retrieveProgress();
setupTreemap(taxonomyCont, d3, treemapID, helpText, true, saveProgress);
setupSvg();
