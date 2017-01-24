
var AutoComplete = (function () {
    "use strict";
    var AutoComplete = function (params, component) {
        //Construct
        if (this) {
            var i,
                self = this,
                defaultParams = {
                    limit: 10,
                    method: "GET",
                    noResult: component.emptyMessage,
                    paramName: "query",


                    select: function (input, item) {
                        attr(input, { "data-autocomplete-old-value": input.value = attr(item, "data-autocomplete-value", item.innerHTML) });
                        component.selectedValue = attr(item, "data-autocomplete-value", item.innerHTML);
                        component.selectedItem = component.response[attr(item, "data-index")];
                        component.fire('autosuggest-select', component.selectedItem);
                        // component.fire('autosuggest-select',component.clearTimeout(50));
                        component.fire('tab-next');
                        closeBox(component.querySelector(".autocomplete"), false);
                    },
                    open: function (input, result) {
                        var self = this;
                        Array.prototype.forEach.call(result.getElementsByTagName("li"), function (li) {
                            li.onmousedown = function (event) {
                                self.select(input, event.target);
                            };
                        });

                    },
                
                    post: function (result, res, custParams) {
                        try {

                            component.$.spinner.hidden = true;
                            var response = JSON.parse(res);


                            if (response.status.isSuccessful) {
                                response = response.items;
                                var groupedByType = {};

                                var typeArr2 = [];

                                for (var item in response) {
                                    var cityn = response[item].type;

                                    if (!typeArr2.includes(cityn)) {
                                        typeArr2.push(cityn);
                                    }


                                    if (!groupedByType[cityn]) {


                                        groupedByType[cityn] = [];

                                    }
                                    groupedByType[cityn].push(response[item]);

                                }

                                var typeUL = domCreate("ul")
                                var ul = domCreate("ul")


                                for (var t = 0; t < typeArr2.length; t++) {

                                    component.response = groupedByType[typeArr2[t]];



                                    var createLi = function () { return domCreate("li"); },

                                        autoReverse = function (param, limit) {
                                            return (limit < 0) ? param.reverse() : param;
                                        },

                                        addLi = function (ul, li, response, index) {

                                            li.innerHTML = response;
                                            attr(li, { "data-autocomplete-value": response });
                                            attr(li, { "data-index": index });
                                            ul.appendChild(li);
                                            return createLi();
                                        },
                                        addType = function (ul, response) {

                                            var p = domCreate("span");
                                           
                                            p.style.color = "Silver";
                                           


                                       
                                       
                                            
                                            p.style.borderBottomStyle = "solid ";
                                          
                                      
                                        
                                        
                                            p.innerHTML = response;
                                            ul.appendChild(p);

                                        },
                                        empty,
                                        i = 0,
                                        length = groupedByType[typeArr2[t]].length,
                                        li = createLi(),
                                        limit = custParams.limit,
                                        propertie,
                                        properties,
                                        value;

                                    if (length) {

                                        addType(ul, typeArr2[t])


                                        response = autoReverse(groupedByType[typeArr2[t]], limit);
                                        var item = null;

                                        for (; i < length && (i < Math.abs(limit) || !limit); i++) {
                                            if (component.tokenParam != '')
                                                item = response[i][component.tokenParam];

                                            li = addLi(ul, li, item, i);



                                        }

                                    }



                                    else {
                                        //If the response is an object or an array and that the response is empty, so this script is here, for the message no response.
                                        empty = true;
                                        attrClass(li, "locked");
                                        li = addLi(ul, li, custParams.noResult);
                                    }




                                }//for
                                if (result.hasChildNodes()) {
                                    result.removeChild(result.lastChild);
                                }

                                result.appendChild(ul);
                                attrClass(result, "autocomplete open");
                                return empty;
                            }//if response
                            else {
                                return empty;
                            }
                        } catch (e) {
                            result.innerHTML = response;
                        }
                    },
                    pre: function (input) {
                        return input.value;
                    },
                    selector: ["input[data-autocomplete]"]
                    // selector:["input[ data-autocomplete-dealy]"]
                },
                selectors;

            self._custArgs = [];
            self._args = merge(defaultParams, params || {});

            selectors = self._args.selector;
            if (!Array.isArray(selectors)) {
                selectors = [selectors];
            }

            selectors.forEach(function (selector) {
                Array.prototype.forEach.call(component.querySelectorAll(selector), function (input) {
                    if (input.nodeName.match(/^INPUT$/i) && input.type.match(/^TEXT|SEARCH$/i)) {
                        var oldValueLabel = "data-autocomplete-old-value",
                            result = component.$.dropBox,

                            request,
                            positionLambda = function () {
                                attr(result, {
                                    "class": "autocomplete"
                                });
                            },
                            destroyLambda = function () {
                                input.onfocus = input.onblur = input.onkeyup = null;
                                input.removeEventListener("position", positionLambda);
                                input.removeEventListener("destroy", destroyLambda);
                                result.parentNode.removeChild(result);

                                self.CustParams(input, true);
                            },
                            focusLamdba = function () {
                                var dataAutocompleteOldValue = attr(input, oldValueLabel);
                                if (!component.caching && result.hasChildNodes()) {
                                    result.removeChild(result.lastChild);
                                }
                                if (!dataAutocompleteOldValue || input.value != dataAutocompleteOldValue) {
                                    // if(input.value == '')
                                    //     request = ajax(request, self.CustParams(input), "", input, result);
                                    attrClass(result, "autocomplete open");
                                }
                            };

                        attr(input, { "autocomplete": "off" });

                        positionLambda(input, result);
                        input.addEventListener("position", positionLambda);
                        input.addEventListener("destroy", destroyLambda);

                        Polymer.dom(component.querySelector('#append')).appendChild(result);

                        input.onfocus = focusLamdba;

                        input.onblur = closeBox(null, result);

                        // input.onreadystatechange = function(e){
                        //                 if(e.keyCode==8 && this.value == "")
                        //                 {
                        document.getElementById("clearContainer").setAttribute('class', 'hide')
                        //  document.getElementById("clearContainer") .style.display='none'; 

                        // elem.classList.add('classname')
                        //  elem.classList.remove('classname')
                        //  define two classes .hide {display : none;}.unhide{display:block;}

                    }
                    // else{
                    // component.$.clearContainer.hidden=true;  
                    // document.getElementById("clearContainer") .style.display='block'; 
                    //  document.getElementById("clearContainer").setAttribute('class','unhide')

                    //                 }
                    // }

                    input.onkeyup = function (e) {
                        var first = result.querySelector("li:first-child:not(.locked)"),
                            input = e.target,
                            custParams = self.CustParams(input),
                            inputValue = custParams.pre(input),
                            dataAutocompleteOldValue = attr(input, oldValueLabel),
                            keyCode = e.keyCode,
                            currentIndex,
                            position,
                            lisCount,
                            liActive;
                        //------------------------------------------

                        if (this.value == "") {
                            document.getElementById("clearContainer").setAttribute('class', 'hide')

                        }
                        else {
                            document.getElementById("clearContainer").setAttribute('class', 'unhide')
                        }


                        //--------------------------------------------

                        if (keyCode == 13 && attrClass(result).indexOf("open") != -1) {
                            liActive = result.querySelector("li.active");
                            if (liActive !== null) {
                                self._args.select(input, liActive);
                                // inputValue = item.innerHTML;
                                attrClass(result, "autocomplete");
                                closeBox(null, result);
                            }
                        }


                        if (keyCode == 13 && attrClass(result).indexOf("open") != -1) {
                            liActive = result.querySelector("li.active");
                            if (liActive !== null) {
                                self._args.select(input, liActive);
                                // inputValue = item.innerHTML;
                                attrClass(result, "autocomplete");
                                closeBox(null, result);
                            }
                        }


                        else {

                            if (keyCode == 38 || keyCode == 40) {
                                liActive = result.querySelector("li.active");
                                if (liActive) {
                                    currentIndex = Array.prototype.indexOf.call(liActive.parentNode.children, liActive);
                                    position = currentIndex + (keyCode - 39);
                                    lisCount = result.getElementsByTagName("li").length;

                                    attrClass(liActive, "selected");

                                    if (position < 0) {
                                        position = lisCount - 1;
                                    } else if (position >= lisCount) {
                                        position = 0;
                                    }

                                    attrClass(liActive.parentElement.childNodes.item(position), "active");
                                } else if (first) {
                                    attrClass(first, "active");
                                }
                            } else if (keyCode < 35 || keyCode > 40) {
                                if (inputValue && custParams.url) {
                                 

                                    if (inputValue.length >= component.minimumCharacters) {
                                        component.$.spinner.hidden = false;



                                       setTimeout(function () {


                                            request = ajax(request, custParams, inputValue.trim(), input, result, component.subType, component.queryParams);
                                        }, component.delay);
                                    }
                                    // if(inputValue.length >= component.minimumCharacters)
                                    // {
                                    //     component.$.result.hidden = true;

                                    //request = ajax(request, custParams, inputValue.trim(), input, result, component.subType, component.queryParams);
                                    // }


                                    else {
                                        if (result.hasChildNodes()) {
                                            result.removeChild(result.lastChild);
                                        }
                                    }
                                }
                            }

                        };
                    }
                });
            });
        } else {
            new AutoComplete(params, component);
        }
    };
    //call to api
    AutoComplete.prototype = {
        CustParams: function (input, toDelete) {
            var dataAutocompleteIdLabel = "data-autocomplete-id",
                self = this,
                prefix = "data-autocomplete",
                params = {
                    limit: prefix + "-limit",

                    method: prefix + "-method",
                    noResult: prefix + "-no-result",
                    paramName: prefix + "-param-name",
                    delay: prefix + "-delay",

                    url: prefix
                },
                paramsAttribute = Object.getOwnPropertyNames(params),
                i;

            if (toDelete) {
                delete self._custArgs[attr(input, dataAutocompleteIdLabel)];
            } else {
                if (!input.hasAttribute(dataAutocompleteIdLabel)) {
                    input.setAttribute(dataAutocompleteIdLabel, self._custArgs.length);

                    for (i = paramsAttribute.length - 1; i >= 0; i--) {
                        params[paramsAttribute[i]] = attr(input, params[paramsAttribute[i]]);
                    }

                    for (i in params) {
                        if (params.hasOwnProperty(i) && !params[i]) {
                            delete params[i];
                        }
                    }

                    if (params.limit) {
                        if (isNaN(params.limit)) {
                            delete params.limit;
                        } else {
                            params.limit = parseInt(params.limit);
                        }
                    }
                    // if(params.delay)
                    // {
                    //     params.delay=(params.delay);
                    // }

                    self._custArgs.push(merge(self._args, params));
                }

                return self._custArgs[attr(input, dataAutocompleteIdLabel)];
            }
        }
    };

    function ajax(request, custParams, value, input, result, subType, queryParams) {
        if (request) {
            request.abort();
        }

        var method = custParams.method,
            url = custParams.url;

        url = url + value;
        if (subType != '')
            url = url + "/" + subType;

        if (queryParams != "") {
            url += "?" + queryParams;
        }

        request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("Accept", "application/json");

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                if (!custParams.post(result, request.response, custParams)) {
                    custParams.open(input, result);
                }
            }
        };

        request.send(queryParams);

        return request;
    }


    function closeBox(result, closeNow) {

        if (closeNow) {
            attrClass(result, "autocomplete");
        } else {
            setTimeout(function () { closeBox(result, true); }, 150);
        }
    }

    //Method deported
    function merge(obj1, obj2) {
        var concat = {},
            tmp;

        for (tmp in obj1) {
            concat[tmp] = obj1[tmp];
        }

        for (tmp in obj2) {
            concat[tmp] = obj2[tmp];
        }

        return concat;
    }

    return AutoComplete;
} ());

function attr(item, attrs, defaultValue) {
    if (item) {
        try {
            for (var key in attrs) {
                item.setAttribute(key, attrs[key]);
            }
        } catch (e) {
            return item.hasAttribute(attrs) ? item.getAttribute(attrs) : defaultValue;
        }
    }
}

function attrClass(item, value) {
    if (item) {
        return attr(item, !value ? "class" : { "class": value });
    }
}

function domCreate(item) {
    return document.createElement(item);
}