"use strict";

var InputPanel = React.createClass({
  displayName: "InputPanel",

  textHandler: function textHandler(e) {
    this.props.updateText(e.target.value, e.target.dataset.id);
  },
  clickHandler: function clickHandler(e) {
    //console.log("button id: " + e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id == "save") {

      var recipe_text = $("#recipe").val();
      var ingradients_text = $("#ingradients").val();

      if (recipe_text) {

        recipe_text = recipe_text[0].toUpperCase() + recipe_text.substring(1); // Make title of recipe with capital latter

        /* *********SAVE TO LOCAL STORAGE***************/
        if (this.props.mode == "edit") localStorage.removeItem(this.props.defaultValueForRecipe + customInstances.suffix);

        localStorage.setItem(recipe_text + customInstances.suffix, ingradients_text);
        /**********************************/

        /* **********CHECK IF MODE IS EDIT OR SAVE AND REFRESH RECIPES ON LAYOUT ************** */
        if (this.props.mode == 'edit') {

          var items = this.props.items.slice();

          for (var i = 0; i < items.length; i++) {
            if (items[i][0] == this.props.defaultValueForRecipe) {
              items[i][0] = this.props.recipe;
              items[i][1] = this.props.ingradients;
            }
          }var parent = this.props.eventParent;

          var id = parent.dataset.id;

          var index = -1;

          // locate clicked element in arr
          for (i = 0; i < items.length; i++) {
            if (items[i].props["data-id"] == id) {
              index = i;break;
            }
          }items[index] = customInstances.boxPattern(items[index].props.className, recipe_text, items[index].props['data-pulled'] - 1, ingradients_text);

          this.props.recipeBoxes.setState({
            htmlDivs: items
          });
        } else if (this.props.mode == 'save') {

          var divs = this.props.recipeBoxes.scrollerController.addNewItem([recipe_text, ingradients_text]);
          this.props.recipeBoxes.setState({
            htmlDivs: divs == null ? this.props.recipeBoxes.state : divs
          });
        }

        /************************************************/
      }

      this.props.controller.setState({
        closed: true
      });
    }
    this.props.recipeBoxes.state.busy = false;
    this.props.closeMe(null);
  },
  render: function render() {

    return React.createElement(
      "div",
      { className: "input-panel animated " + (this.props.closed ? "fadeOutUp" : "fadeInDown") },
      React.createElement(
        "div",
        { className: "input-form" },
        React.createElement("input", { type: "text", id: "recipe", className: "form-control", "data-id": "recipe_field", value: this.props.recipe, onChange: this.textHandler }),
        React.createElement("textarea", { id: "ingradients", "data-id": "ingradients_field", value: this.props.ingradients, onChange: this.textHandler }),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-primary", "data-id": "save", onClick: this.clickHandler.bind(this) },
          " Save "
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-danger", "data-id": "close", onClick: this.clickHandler.bind(this) },
          " Close "
        )
      ),
      React.createElement(
        "div",
        { className: "blured-bg" },
        "  "
      )
    );
  }

}); // DONE

var Controller = React.createClass({
  displayName: "Controller",

  // ADD BUTTON FOR NEW ITEMS
  toggleMyChild: function toggleMyChild(obj) {

    if (obj == null) this.setState({
      closed: !this.state.closed,
      recipe: null,
      ingradients: null,
      mode: null,
      defaultValueForRecipe: null
    });else this.setState({
      items: obj.items,
      closed: !this.state.closed,
      recipeBoxes: obj.recipeBoxes,
      eventParent: obj.eventParent,
      mode: obj.mode,
      defaultValueForRecipe: obj.recipe,
      recipe: obj.recipe,
      ingradients: obj.ingradients
    });
  }, //DONE
  updateTextValue: function updateTextValue(text, id) {
    this.state[id == "recipe_field" ? "recipe" : "ingradients"] = text;
    this.setState(this.state); // WARNING
  },
  getInitialState: function getInitialState() {
    //localStorage.removeItem("RECIPESTARTUP"); // REMOVE THIS FOR FULL CONTROL
    return {
      closed: true
    };
  },
  render: function render() {

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "nodes" },
        React.createElement(ScrollButtonBar, { toggleMyChild: this.toggleMyChild, closed: this.state.closed })
      ),
      React.createElement(InputPanel, {
        controller: this,
        items: this.state.items,
        recipeBoxes: this.state.recipeBoxes,
        eventParent: this.state.eventParent,
        closeMe: this.toggleMyChild,
        closed: this.state.closed,
        recipe: this.state.recipe,
        ingradients: this.state.ingradients,
        updateText: this.updateTextValue,
        mode: this.state.mode,
        defaultValueForRecipe: this.state.defaultValueForRecipe
      })
    );
  }

}); // DONE

var Recipes = React.createClass({
  displayName: "Recipes",

  //DONE

  render: function render() {

    return React.createElement(
      "div",
      null,
      this.props.items
    );
  }

});

var ScrollerHelper = function ScrollerHelper(items, getItems, createDivs) {

  this.items = items;
  this.offset = items.length > 3 ? 3 : items.length;
  this.list = [this.offset]; // LIST FOR OFFSETS
  this.currentList = items.slice(0, this.offset);
  this.currentCount = 0;

  this.scrollRight = function () {

    //console.log("scrollRight scrollHelper");
    if (this.offset == this.items.length) return null;

    this.currentCount++;
    var prevOffset = this.offset;

    if (this.offset + this.list[0] > this.items.length) {
      this.offset += this.items.length - this.offset;
    } else this.offset += this.list[0];

    this.list.push(this.offset);
    //console.log("HERE IS LOG FOR U ");
    //console.log("prevOffset: " + prevOffset + "  this.offset: " + this.offset);
    this.currentList = this.items.slice(prevOffset, this.offset);

    //for ( let y = 0; y < this.items.length; y++ )
    //  console.log("this.items["+y+"].props['data-id']: " + this.items[y].props['data-id']);

    // console.log('------------------');

    //for ( let y = 0; y < this.currentList.length; y++ )
    //  console.log("this.currentList["+y+"].props['data-id']: " + this.currentList[y].props['data-id']);

    return this.currentList;
  };
  this.scrollLeft = function () {

    // console.log("scrollLeft scrollHelper");
    if (this.list.length == 1) return null;

    // console.log("this.list: " + this.list);

    this.currentCount--;
    this.list.pop();
    this.offset = this.list[this.list.length - 1];

    //var prevOffset = ( this.offset - 3 ) % 3 == 0 ? this.offset - 3 :
    //                  ( (this.offset - 2 ) % 3 == 0 ? this.offset - 2 : this.offset -1 );

    this.currentList = this.items.slice(this.list.length == 1 ? 0 : this.list[this.list.length - 2], this.list[this.list.length - 1]);

    return this.currentList;
  };
  this.scrollReset = function (newItems) {
    console.log("scrollReset scrollHelper");
    this.items = newItems;
    this.offset = newItems.length > 3 ? 3 : newItems.length;
    this.list = [this.offset]; // LIST FOR OFFSETS
    this.currentList = newItems.slice(0, this.offset);
    /*
    
    for ( let y = 0; y < this.items.length; y++ )
              console.log("this.items[y].props['data-id']: " + this.items[y].props['data-id']);
    console.log("this.currentCounr: "+ this.currentCount); */
    if (this.currentCount != 0) for (var i = 0; i < this.currentCount; i++) {
      this.scrollRight();
    }return this.currentList;
  };

  this.addNewItem = function (nonReactItems) {
    var recipe = nonReactItems[0];
    var ingradients = nonReactItems[1];

    localStorage.setItem(recipe + customInstances.suffix, ingradients);

    var arr = createDivs(getItems());

    this.currentCount = 0;
    this.scrollReset(arr);
    // console.log("recipe: " + recipe);
    var found = false;
    do {

      for (var i = 0; i < this.currentList.length; i++) {
        //   console.log("currentList["+i+"].props['data-id']: "+ this.currentList[i].props['data-id']);
        if (this.currentList[i].props['data-id'] == recipe) break;
      }

      //  console.log("000000000000000000000000000")
      if (i == this.currentList.length) {
        if (this.scrollRight() == null) {
          found = true;
          console.log("DEAD");
        }
      } else found = true;
    } while (!found);

    return this.currentList;
  };
};

var ScrollButtonBar = React.createClass({
  displayName: "ScrollButtonBar",

  getItems: function getItems() {
    var items = [];

    if (typeof Storage === "undefined") {
      items.push("NOT AVAL", "NOT AVAL");
      return items;
    }

    console.log("items.length: " + items.length);
    if (localStorage.getItem("RECIPESTARTUP") == null) {
      localStorage.setItem("RECIPESTARTUP", "text");
      console.log("Nije u bazi bio");

      localStorage.setItem("Tost---UNIQUE", "hleb, salama, mileram, toster");

      localStorage.setItem("Kremenadla---UNIQUE", "zejtin, sos ili vegeta, kremenadla, ringla, tiganj");

      localStorage.setItem("Pljeska---UNIQUE", "pare, hod, cekanje");

      localStorage.setItem("Test---UNIQUE", "test1, test2, test3");
    }

    for (var key in localStorage) {
      var mKey = key.split("---");
      if (mKey[1] == "UNIQUE") items.push([mKey[0], localStorage[key]]);
    }
    console.log("init items.length: " + items.length);
    return items;
  },

  createDivs: function createDivs(items) {
    var divs = [];
    //console.log("this.props.items.length: " + this.props.items.length);
    for (var i = 0; i < items.length; i++) {

      var customItems = customInstances.createList(items[i][1]);

      divs.push(React.createElement(
        "div",
        { className: "node animated fadeInRight", "data-id": items[i][0], "data-pulled": 1, "data-body": items[i][1] },
        React.createElement(
          "button",
          { className: "eraser" },
          " Erase "
        ),
        React.createElement(
          "button",
          { className: "more" },
          " more "
        ),
        React.createElement(
          "button",
          { className: "editer" },
          " Edit "
        ),
        React.createElement(
          "div",
          { className: "recipe" },
          React.createElement(
            "div",
            { className: "title" },
            items[i][0]
          ),
          React.createElement("div", { className: "body", dangerouslySetInnerHTML: { __html: customItems } })
        )
      ));
    }
    return divs;
  },
  getInitialState: function getInitialState() {

    // ( initial items, function getter for items, function for creating divs )
    this.scrollerController = new ScrollerHelper(this.createDivs(this.getItems()), this.getItems, this.createDivs);

    return {
      htmlDivs: this.scrollerController.currentList,
      busy: false
    };
  },

  checkForOverflow: function checkForOverflow() {
    var nodes = $(".body");
    for (var i = 0; i < nodes.length; i++) {
      var $parentParent = $(nodes[i]).parent().parent();
      if (this.overflow(nodes[i])) $parentParent.find('.more').css('visibility', 'visible');
    }
  },
  overflow: function overflow(element) {
    return element.scrollHeight > element.clientHeight;
  },
  registerHandlers: function registerHandlers() {
    $(".eraser").off("click").on("click", function (event) {

      var parent = event.target.parentNode;
      Buttons.erase.call(this, parent);
    }.bind(this));

    $(".editer").off("click").on("click", function (event) {

      if (!this.props.closed) // If input panel is not closed, then return
        return;

      var parent = event.target.parentNode;
      Buttons.edit.call(this, parent, parent.dataset.id, parent.dataset.body);
    }.bind(this));

    $(".more").off("click").on("click", function (event) {

      if (!this.props.closed) // If input panel is not closed, then return
        return;

      var parent = event.target.parentNode;
      Buttons.edit.call(this, parent, parent.dataset.id, parent.dataset.body);
    }.bind(this));
  },
  componentDidMount: function componentDidMount() {
    this.registerHandlers();
    this.checkForOverflow();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.registerHandlers();
    this.checkForOverflow();
  },

  scrollerController: null,
  receiveAddNewItem: function receiveAddNewItem() {

    Buttons.addNew.call(this);
  },
  recieveScrollLeft: function recieveScrollLeft() {
    if (this.state.busy) return console.log("BUSY IN recieveScrollLeft");
    this.state.busy = true;
    var divs = this.scrollerController.scrollLeft.call(this.scrollerController);
    this.setState({
      htmlDivs: divs == null ? this.state.htmlDivs : divs, busy: false
    });
  },
  recieveScrollRight: function recieveScrollRight() {
    if (this.state.busy) return console.log("BUSY IN recieveScrollRight");
    this.state.busy = true;
    var divs = this.scrollerController.scrollRight.call(this.scrollerController);
    this.setState({
      htmlDivs: divs == null ? this.state.htmlDivs : divs, busy: false
    });
  }, // DONE

  render: function render() {
    console.log("render [" + this.constructor.displayName + "] ");
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "scroll-buttons" },
        React.createElement(
          "button",
          { type: "button", onClick: this.recieveScrollLeft },
          " left "
        ),
        React.createElement(
          "button",
          { type: "button", onClick: this.receiveAddNewItem.bind(this) },
          " add "
        ),
        React.createElement(
          "button",
          { type: "button", onClick: this.recieveScrollRight, style: this.state.styleForRight },
          " right "
        )
      ),
      React.createElement(Recipes, { items: this.state.htmlDivs, toggleMyChild: this.props.toggleMyChild, closed: this.props.closed })
    );
  }

});

var Buttons = {
  // SOLVE THIS CREATECUSTOM
  erase: function erase(eventParent) {

    if (this.state.busy) return console.log("BUSY");
    this.state.busy = true;

    var parent = eventParent;

    var arr = this.state.htmlDivs;
    var id = parent.dataset.id;

    var index = -1;

    // locate clicked element in arr
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].props["data-id"] == id) {
        index = i;break;
      }
    }
    // BELOW  
    localStorage.removeItem(id + customInstances.suffix);
    // NOTIF
    // change current item with new customInstances.boxPattern with class fadeOutLeft
    arr[index] = customInstances.boxPattern('node animated fadeOutLeft', index + 1 < arr.length ? [arr[index + 1].props['data-id']] : "deleted", arr[index].props['data-pulled'] - 1, 'erase');
    this.setState({
      htmlDivs: arr
    });
    ///////////////////////////////

    var self = this;

    if (index + 1 < arr.length)
      // set timeouts for divs below clicked one, so it smooth come above
      for (var i = index + 1, y = 1; i < arr.length; i++, y++) {
        // if below clicked items is item that have been erased in past ( we didnt's erase him, just put class fadeOutLeft, so he is still there), we continue cause he is invisible
        if (arr[i].props.className.indexOf('fadeOutLeft') != -1) continue;

        (function (i, y) {

          setTimeout(function () {
            // set animation to fade in up and set margin with function boxPattern
            arr[i] = customInstances.boxPattern('node animated fadeInUp', arr[i].props['data-id'], arr[i].props['data-pulled'], arr[i].props['data-body'], 'erase');

            self.setState({
              htmlDivs: arr
            });

            //////////////////////////////////////////////

            setTimeout(function () {

              arr[i] = customInstances.boxPattern('node animated', arr[i].props['data-id'], arr[i].props['data-pulled'] - 1, arr[i].props['data-body'], 'erase');

              self.setState({
                htmlDivs: arr
              });
            }, 800);

            if (i == arr.length - 1) {

              var baseArr = self.scrollerController.items;
              var len = baseArr.length;
              //console.log("B arr.length: " + baseArr.length);
              var fArr = baseArr.slice(0, index);
              var sArr = null;
              if (index < len - 1) sArr = fArr.concat(baseArr.slice(index + 1, baseArr.length));

              setTimeout(function () {

                self.setState({
                  htmlDivs: self.scrollerController.scrollReset(sArr == null ? fArr : sArr)
                });

                setTimeout(function () {

                  self.state.busy = false;
                }, 200);
              }, 1100);
            }
          }, 750 * y);
        })(i, y);
      } else setTimeout(function () {
      var baseArr = self.scrollerController.items;
      var len = baseArr.length;
      // console.log("B arr.length: " + baseArr.length);
      var fArr = baseArr.slice(0, index);
      var sArr = null;
      if (index < len - 1) sArr = fArr.concat(baseArr.slice(index + 1, baseArr.length));

      self.setState({
        htmlDivs: self.scrollerController.scrollReset(sArr == null ? fArr : sArr)
      });

      setTimeout(function () {

        self.state.busy = false;
      }, 300);
    }, 200);
  },
  edit: function edit(eventParent, recipe_name, ingradients) {

    this.props.toggleMyChild({

      eventParent: eventParent,
      items: this.state.htmlDivs,
      recipeBoxes: this,
      recipe: recipe_name,
      ingradients: ingradients,
      mode: "edit"

    });
  },
  addNew: function addNew() {

    if (this.state.busy) return console.log("BUSY");
    this.state.busy = true;
    this.props.toggleMyChild({

      items: null,
      recipeBoxes: this,
      eventParent: null,
      mode: 'save',
      defaultValueForRecipe: null,
      recipe: "",
      ingradients: ""

    });
  }

};

var customInstances = {
  suffix: "---UNIQUE",
  boxPattern: function boxPattern(csl, id, offset, body, mode) {

    var customItems;
    if (id !== 'deleted' && !Array.isArray(id)) customItems = this.createList(body);

    var divStyle = null;
    if (offset != undefined) {

      var m_t = -200 * offset + 5;
      var m_b = 200 * offset;

      divStyle = {
        marginTop: m_t,
        marginBottom: m_b
      };
    } else {

      offset = 0;
    }
    return React.createElement(
      "div",
      {
        className: csl,
        style: divStyle,
        "data-id": id,
        "data-pulled": ++offset,
        "data-body": body
      },
      React.createElement(
        "button",
        { className: "eraser" },
        " Erase "
      ),
      React.createElement(
        "button",
        { className: "more" },
        " more "
      ),
      React.createElement(
        "button",
        { className: "editer" },
        " Edit "
      ),
      React.createElement(
        "div",
        { className: "recipe" },
        React.createElement(
          "div",
          { className: "title" },
          Array.isArray(id) ? id[0] : id
        ),
        id == 'deleted' || mode != undefined ? React.createElement(
          "div",
          null,
          React.createElement("i", { className: "fa fa-circle-o-notch fa-spin fa-3x fa-fw", style: { marginLeft: 50 + "px" } }),
          " ",
          React.createElement(
            "span",
            { className: "sr-only" },
            "Loading..."
          )
        ) : React.createElement("div", { className: "body", dangerouslySetInnerHTML: { __html: customItems } })
      )
    );
    debugger;
  },
  createList: function createList(items) {

    var customItems = items;
    customItems = customItems.split(',');

    for (var i = 0; i < customItems.length; i++) {
      customItems[i] = "- " + customItems[i] + "<br>";
    }customItems = customItems.join('');

    return customItems;
  }

};

ReactDOM.render(React.createElement(Controller, null), document.getElementById("content"));