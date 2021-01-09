/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => /* binding */ App
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./utils.js");


let _instance;

class App {
    constructor(canvas) {
        this.canvas = canvas;

        /** @type {Component[]} */
        this._components = [];
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.ctx.strokeStyle = '#222222';
        this.ctx.fillStyle = '#7affd1';
        this.ctx.font = '12px sans-serif';
        this.lastHovered = null;
        this.lastActivated = null;
        this._init();
    }

    static get instance() {
        return _instance || (i => _instance = i)(new App(document.getElementById('canvas')));
    }

    static onContextMenu(e) {
        e.preventDefault();
        return false;
    }

    /** @param {Component[]} components */
    set components(components) {
        this._components = components;
    }

    /** @returns {Component[]} */
    get components() {
        return this._components;
    }

    _init() {
        this.canvas.addEventListener('mousemove', (0,_utils__WEBPACK_IMPORTED_MODULE_0__.throttle)().bind(undefined, this.onMouseMove.bind(this)));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('contextmenu', App.onContextMenu);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    }

    dispatch(e) {
        this.canvas.dispatchEvent(e);
    }

    listen(eventType, handler) {
        this.canvas.addEventListener(eventType, handler);
    }

    unlisten(eventType, handler) {
        this.canvas.removeEventListener(eventType, handler);
    }

    onMouseUp() {
        this.lastActivated && this.lastActivated.onMouseUp();
    }

    onMouseDown(e) {
        e.preventDefault();
        const {offsetX: x, offsetY: y, button} = e;
        let topMost;
        for (let i = 0, zIndex = -1, items = this._components, length = items.length; i < length; i++) {
            if (
                items[i].zIndex > zIndex && (
                    items[i].x < x &&
                    items[i].y < y &&
                    (items[i].x + items[i].width) > x &&
                    (items[i].y + items[i].height) > y
                )
            ) {
                topMost = items[i];
                zIndex = topMost.zIndex;
            }
        }
        !Object.is(topMost, this.lastActivated) &&
            this.lastActivated && (
                this.lastActivated.onBlur() || this.lastActivated.onMouseOut()
        );
        this.lastActivated = topMost;
        topMost && (
            button === 2 ?
                topMost.onContextMenu({x, y}) : topMost.onMouseDown({x, y})
        );
    }

    onMouseMove({offsetX: x, offsetY: y}) {
        let topMost;
        for (let i = 0, zIndex = -1, items = this._components, length = items.length; i < length; i++) {
            if (
                items[i].zIndex > zIndex && (
                    items[i].x < x &&
                    items[i].y < y &&
                    (items[i].x + items[i].width) > x &&
                    (items[i].y + items[i].height) > y
                )
            ) {
                topMost = items[i];
                zIndex = topMost.zIndex;
            }
        }
        !Object.is(topMost, this.lastHovered) &&
            this.lastHovered &&
                this.lastHovered.onMouseOut();
        this.lastHovered = topMost;
        topMost && topMost.onMouseOver({x, y});
    }

    onTouchStart(e) {
        this.pointerContextMenuDelay = setTimeout(this.onTouchContextMenu.bind(this), 500, e);
        this.canvas.addEventListener('touchmove', this);
        this.canvas.addEventListener('touchend', this);
    }

    onTouchContextMenu({touches: [{pageX, pageY}]}) {
        const {offsetTop, offsetLeft} = this.canvas;
        this.onMouseDown({
            offsetX: Math.round(pageX - offsetLeft),
            offsetY: Math.round(pageY - offsetTop),
            button: 2,
            preventDefault() {}
        });
        this.handleEvent();
    }

    assignLastActivated(component) {
        this.lastActivated && this.lastActivated.onBlur();
        this.lastActivated = component;
    }

    repaintAffected({id, x, y, width, height, zIndex}) {
        for (let i = 0, items = this._components, length = items.length; i < length; i++) {
            if (
                items[i].id !== id &&
                items[i].zIndex > zIndex && (
                    (
                        items[i].y >= y && items[i].y <= (y + height) ||
                        items[i].y <= y && (items[i].y + items[i].height) >= y
                    ) && (
                        items[i].x >= x && items[i].x <= (x + width) ||
                        items[i].x <= x && (items[i].x + items[i].width) >= x
                    )
                )
            ) {
                items[i].render();
            }
        }
    }

    render() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0, items = this._components, length = items.length; i < length; i++) {
            items[i].render();
        }
    }

    handleEvent() {
        clearTimeout(this.pointerContextMenuDelay);
        this.canvas.removeEventListener('touchmove', this);
        this.canvas.removeEventListener('touchend', this);
    }
}


/***/ }),

/***/ "./components/button.js":
/*!******************************!*\
  !*** ./components/button.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => /* binding */ Button
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



class Button extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({value= 'Apply', callback = () => {}, ...params}) {
        super(params);
        this.name = 'Button';
        this.pressed = false;
        this.value = value;
        this.fontSize = 12;
        this.callback = callback;
        const ctx = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx;
        ctx.save();
            ctx.font = `bold ${this.fontSize}px sans-serif`;
            Object.assign(this, Button.geometric, {width: ctx.measureText(value).width + 20});
        ctx.restore();
        this.x += Button.geometric.width - this.width - 2;
    }

    static get geometric() {
        return {
            width: 50,
            height: 20
        }
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, fontSize, pressed, radius = 3}, ctx) {
        ctx.fillRect(x - 3, y - 3, width + 9, height + 9);
        ctx.save();
            ctx.fillStyle = '#a2a2a2';
            if (!pressed) {
                ctx.fillStyle = '#b1b1b1';
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'rgba(127,127,127,0.7)';
            }
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.fill();
            if (pressed) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 2, y + 2 + height - radius);
                ctx.lineTo(x + 2, y + 2 + radius);
                ctx.arcTo(x + 2, y + 2, x + 2 + radius, y, radius);
                ctx.lineTo(x + 2 + width - radius, y + 2);
                ctx.stroke();
            }
        ctx.restore();
        ctx.save();
            ctx.fillStyle = '#353535';
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillText(value, x + 10, y + height - 5);
        ctx.restore();
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'pointer';
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
    }

    onMouseDown() {
        super.onMouseDown();
        this.pressed = true;
        this.render();
        this.callback();
    }

    onMouseUp() {
        this.pressed = false;
        this.render();
    }

    render() {
        Button.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./components/chart-item.js":
/*!**********************************!*\
  !*** ./components/chart-item.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChartItem": () => /* binding */ ChartItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




class ChartItem extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'ChartItem';
        this.scale = 1;
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this.dataDrawAreaMap = [];
        this.ctxMenuConfig = [
            {
                title: 'Zoom In',
                children: [],
                type: this.setScale.bind(this, 1.1)
            },
            {
                title: 'Zoom Out',
                children: [],
                type: this.setScale.bind(this, 0.9)
            },
            {
                title: 'Zoom Reset',
                children: [],
                type: this.resetScale.bind(this)
            }
        ];
        this._init();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render(config, ctx) {
        const chartMargin = 20;
        const {x, y, width, height, padding, data: {points}} = config;
        const chartArea = {
            x: x + padding[3],
            y: y + padding[0],
            width: width - padding[1] - padding[3],
            height: height - padding[0] - padding[2]
        };
        const {min, max} = ChartItem.normalizeRange(points);
        const rangeScale = (chartArea.height - chartMargin) / (max - min);
        const zeroLevel = Math.floor((chartArea.y + chartMargin / 2) + max * rangeScale);
        ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = 'rgba(127, 127, 127, 0.2)';
            ctx.fillRect.apply(ctx, Object.values(chartArea));
        ctx.restore();
        ChartItem.drawXAxis({...config, ...chartArea}, ctx);
        ChartItem.drawYAxis({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        return ChartItem.drawData({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawData({x, y, width, height, padding, scale, data: {points = [], margin = 0.2}, zeroLevel, rangeScale}, ctx) {
        const dataDrawAreaMap = [...points];
        ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();
            ctx.setTransform(1, 0, 0, 1, x, zeroLevel);
            for (let i = 0,
                     length = points.length,
                     step = width / length,
                     barWidth = step * (1 - margin),
                     barHeight = -points[i].value * scale * rangeScale,
                     xPos = step / 2 - barWidth / 2,
                    fillStyle = points[i].value > 0 ? (
                        points[i].highlighted ? '#006b00' : '#00ff00') :
                        (points[i].highlighted ? '#810000' : '#ff0000');
                 i < length;
                 i++, xPos += step) {
                fillStyle = points[i].value > 0 ? (
                    points[i].highlighted ? '#006b00' : '#00ff00') :
                    (points[i].highlighted ? '#810000' : '#ff0000');
                barHeight = -points[i].value * scale * rangeScale;
                ctx.fillStyle = fillStyle;
                ctx.fillRect(xPos, 0, barWidth, -points[i].value * scale * rangeScale);
                dataDrawAreaMap[i] = {
                    ...dataDrawAreaMap[i],
                    ...{
                        x: xPos + x,
                        y: Math.min(zeroLevel, zeroLevel + barHeight),
                        width: barWidth,
                        height: Math.abs(barHeight)
                    }
                };
            }
        ctx.restore();
        return dataDrawAreaMap;
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawXAxis({x, y, width, height, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#3c3c3c';
            ctx.fillStyle = '#3c3c3c';
            ctx.beginPath();
            ctx.moveTo(x, y + height + 5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            for (let i = 0,
                     step = width  / points.length,
                     xPos = x + step / 2,
                     roundedXPos = Math.round(xPos);
                 i < points.length;
                 i++, xPos += step, roundedXPos = Math.round(xPos)) {
                ctx.beginPath();
                ctx.moveTo(roundedXPos, y + height + 5);
                ctx.lineTo(roundedXPos, y);
                ctx.stroke();
                ctx.save();
                    ctx.font = '10px sans-serif';
                    ctx.setTransform(1, 0, 0, 1, roundedXPos + 5, y + height + ctx.measureText(points[i].category).width + 5)
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText(points[i].category, 0, 0);
                ctx.restore();
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawYAxis({x, y, width, height, ticks = 5, zeroLevel, scale, rangeScale, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            ctx.fillStyle = '#1a1a1a';
            ctx.font = 'bold 14px sans-serif';
            const interval = Math.floor(height / ticks);
            for (let i = 0,
                     yPos = y + height - Math.abs(zeroLevel - y - height) % interval,
                     label = ((zeroLevel - yPos) / rangeScale / scale).toFixed(2);
                 i < ticks;
                 yPos -= interval,
                 i++, label = ((zeroLevel - yPos ) / rangeScale / scale).toFixed(2)) {
                ctx.beginPath();
                ctx.moveTo(x - 5, yPos);
                ctx.lineTo(x + width, yPos);
                ctx.stroke();
                ctx.fillText(label, x - ctx.measureText(label).width - 10, yPos);
            }
        ctx.restore();
    }

    static normalizeRange(data) {
        return data.reduce(({min, max, maxNegative, minPositive}, {value}) => (
            {
                min: Math.min(value, min),
                max: Math.max(value, max)
            }
        ), {
            min: Infinity,
            max: -Infinity
        });
    }

    static mockData() {
        return new Array(30).fill([1, -1]).map((bi, idx) => (
            {
                category: `Category${idx + 1}`,
                value: Math.floor(Math.random() * 10000* bi[Math.round(Math.random())]) / 100,
            }
        ))
    }

    _init() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('randomizeChartData', this);
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.data.points = ChartItem.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    resetScale() {
        this.scale = 1;
    }

    setScale(scale = 1) {
        this.scale *= scale;
        this.render();
    }

    highlightItems({x, y}) {
        let highlighted = null;
        this.tooltipContent = '';
        super.onMouseOut();
        this.data.points.forEach(i => {
            const {x: itemX, y: itemY, width, height} = i;
            i.highlighted = itemX < x &&
                                itemY < y &&
                                    (itemX + width) > x &&
                                        (itemY + height) > y;
            if (i.highlighted) highlighted = i;
        });
        this.render();
        if (highlighted) {
            this.tooltipContent = highlighted.value;
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...{x, y}});
        }
    }

    handleEvent({type, offsetX: x, offsetY: y}) {
        switch (type) {
            case 'mousemove':
                this.throttle(this.highlightItems.bind(this), {x, y});
                break;
            case 'randomizeChartData':
                this.data.points = ChartItem.mockData();
                this.render();
                break;
            default:
        }
    }
}


/***/ }),

/***/ "./components/clock.js":
/*!*****************************!*\
  !*** ./components/clock.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Clock": () => /* binding */ Clock
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tooltip */ "./components/tooltip.js");





class Clock extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'Clock';
        this.value = this.tooltipContent = '';
        this.fontSize = 20;
        Object.assign(this, Clock.geometric);
        this._init();
    }

    static get geometric() {
        return {
            width: 30,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, fontSize}, ctx) {
        ctx.fillRect(x, y, width, height);
        ctx.save();
			ctx.fillStyle = '#161616';
			ctx.font = `bold ${fontSize}px sans-serif`;
			const fontHeight = ctx.measureText(value).actualBoundingBoxAscent;
			ctx.fillText(value, x + 1, y + fontHeight + 5);
        ctx.restore();
    }

    _init() {
        const ctx = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx;
        setInterval(this.onValueChange.bind(this), 1000);
        this.setValue((0,_utils__WEBPACK_IMPORTED_MODULE_2__.timeFormat)(Date.now()));
        ctx.save();
            ctx.font = `bold ${this.fontSize}px sans-serif`;
            this.width = Math.ceil(ctx.measureText(this.value).width) + 1;
        ctx.restore();
        this.x = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.width - this.width;
    }

    onMouseOver(pos) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...pos});
    }

    onMouseOut() {
        clearTimeout(this.tooltipTimeout);
        _tooltip__WEBPACK_IMPORTED_MODULE_3__.Tooltip.instance.hide();
    }

    setValue(value) {
        this.value = this.tooltipContent = value;
        this.render();
    }

    onValueChange() {
        this.setValue((0,_utils__WEBPACK_IMPORTED_MODULE_2__.timeFormat)(Date.now()));
    }

    render() {
        Clock.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./components/collection-item.js":
/*!***************************************!*\
  !*** ./components/collection-item.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectionItem": () => /* binding */ CollectionItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _value_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./value-item */ "./components/value-item.js");




class CollectionItem {

    /** @returns {Component[]} */
    static compose({x, y, cols, rows, gap = 20, ctor}) {
        const {width, height} = ctor.geometric;
        return new Array(rows).fill(_app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx).reduce((result, ctx, row) => (
            [
                ...result,
                ...new Array(cols).fill(ctor).map((ctor, col) => {
                    const [id, xPos, yPos, zIndex] = [
                        _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId,
                        x + col * (width + gap),
                        y + row * (height + gap),
                        (row + 1) * (col + 1)
                    ];
                    const instance = new ctor({id, x: xPos, y: yPos, value: _value_item__WEBPACK_IMPORTED_MODULE_2__.ValueItem.randomValue, zIndex, ctx});
                    instance.initRandomChange();
                    return instance;
                })
            ]
        ), []);
    }
}


/***/ }),

/***/ "./components/combo-box.js":
/*!*********************************!*\
  !*** ./components/combo-box.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComboBox": () => /* binding */ ComboBox
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




class ComboBox extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({width = ComboBox.geometric.width, menuItems = [], variableName, ...params}) {
        super(params);
        this.name = 'ComboBox';
        this.opened = false;
        Object.assign(this, ComboBox.geometric, {width});
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this.variable = {
            name: variableName,
            value: null,
            title: 'Select...'
        };
        this.menuItems = menuItems.map((i, idx) => ({
            ...i,
            ...{
                y: this.y + this.height + idx * this.height,
                height: this.height,
                highlighted: false
            }
        }));
        this.triggerArea = {
            x: this.x + width - 20,
            y: this.y,
            width: 20,
            height: this.height
        }
        this.fullHeight = this.height + menuItems.length * 20;
    }

    static get geometric() {
        return {
            width: 70,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, fullHeight, opened, variable: {title}, menuItems}, ctx) {
        const borderColor = '#808080';
        const fontColor = '#242424';
        const backgroundColor = '#c8c8c8';
        const highlightColor = '#8d8d8d';
        ctx.fillRect(x - 2, y - 2, width + 3, fullHeight + 3);
        ctx.save();
            ctx.fillStyle = fontColor;
            ctx.strokeStyle = borderColor;
            ctx.font = 'bold 12px sans-serif';
            ctx.strokeRect(x, y, width, height);
            ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, x + width - height, height);
                ctx.clip();
                ctx.fillText(title, x + 3, y + height - 5);
            ctx.restore();
            ctx.save();
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x + width - height, y, height, height);
                ctx.font = '12px sans-serif';
                ctx.fillStyle = fontColor;
                ctx.fillText(opened ? '\u25B2' : '\u25BC', x + width - height / 2 - 5, y + height - 6);
            ctx.restore();
            if (!opened) return ctx.restore();
            for (let i = 0,
                     length = menuItems.length,
                     yPos = y + height + 1,
                     fontHeight = ctx.measureText(menuItems[i].title).actualBoundingBoxAscent,
                     textYPos = (height - fontHeight) / 2 + fontHeight;
                 i < length; i++, yPos = y + height + 1 + height * i) {
                ctx.fillStyle = menuItems[i].highlighted ? highlightColor : backgroundColor;
                ctx.fillRect(x, yPos, width, height);
                ctx.fillStyle = fontColor;
                ctx.fillText(menuItems[i].title, x + 3, yPos + textYPos);
            }
        ctx.restore();
    }

    onMouseOver({x, y}) {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = (
            this.triggerArea.x > x ||
            this.triggerArea.y > y ||
            (this.triggerArea.x + this.triggerArea.width) < x ||
            (this.triggerArea.y + this.triggerArea.height) < y
        ) ? 'initial' : 'pointer';
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
    }

    onBlur() {
        this.opened = false;
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onMouseDown({x, y}) {
        super.onMouseDown({x, y});
        if (
            this.triggerArea.x > x ||
            this.triggerArea.y > y ||
            (this.triggerArea.x + this.triggerArea.width) < x ||
            (this.triggerArea.y + this.triggerArea.height) < y
        ) return;
        this.opened = !this.opened;
        this.render();
        this.opened ? (
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this) ||
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousedown', this)
        ) : (
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this) ||
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousedown', this)
        );
    }

    onMenuSelect({offsetX: x, offsetY: y}) {
        if (
            this.triggerArea.x < x &&
            this.triggerArea.y < y &&
            (this.triggerArea.x + this.triggerArea.width) > x &&
            (this.triggerArea.y + this.triggerArea.height) > y
        ) return;
        const selectedItem = this.menuItems.find(({y: menuY, height}) => (
            this.x < x &&
            menuY < y &&
            (this.x + this.width) > x &&
            (menuY + height) > y
        ));
        this.hideMenu();
        selectedItem && (this.setValue(selectedItem) || this.render());
    }

    hideMenu() {
        this.opened = false;
        this.render();
    }

    render() {
        ComboBox.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render({...this, ...{height: this.fullHeight}});
    }

    highlightItems({offsetX: x, offsetY: y}) {
        this.menuItems.forEach(i => {
            const {y: itemY, height} = i;
            i.highlighted = this.x < x &&
                itemY < y &&
                (this.x + this.width) > x &&
                (itemY + height) > y;
        });
        this.render();
    }

    setValue({title, value}) {
        Object.assign(this.variable, {title, value});
        // App.instance.dispatch(new CustomEvent('updateLocalVariable', {detail: this.variable}));
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousedown':
                this.onMenuSelect(e);
                break;
            case 'mousemove':
                this.throttle(this.highlightItems.bind(this), e);
                break;
            default:
        }
    }
}


/***/ }),

/***/ "./components/component.js":
/*!*********************************!*\
  !*** ./components/component.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => /* binding */ Component
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _context_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context-menu */ "./components/context-menu.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltip */ "./components/tooltip.js");
/* harmony import */ var _hover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hover */ "./components/hover.js");





let _id = 0;

class Component {
    constructor(params) {
        this.visible = true;
        this.zIndex = -1;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.ctxMenuConfig = [];
        this.tooltipContent = '';
        this.name = '';
        Object.assign(this, params);
        this.tooltipTimeout = 0;
        this.firstRender = true;
    }

    static get nextId() {
        return (_id++).toString();
    }

    onContextMenu(pos) {
        _context_menu__WEBPACK_IMPORTED_MODULE_1__.ContextMenu.instance.show({...this, ...pos});
    }

    onBlur() {
    }

    onMouseUp() {}

    onMouseDown() {}

    onMouseOver(pos) {
        _hover__WEBPACK_IMPORTED_MODULE_3__.Hover.instance.show(this);
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...pos});
    }

    onMouseOut() {
        clearTimeout(this.tooltipTimeout);
        _tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.hide();
        _hover__WEBPACK_IMPORTED_MODULE_3__.Hover.instance.hide();
    }

    render(config = this) {
        if (this.firstRender) return this.firstRender = false;
        _app__WEBPACK_IMPORTED_MODULE_0__.App.instance.repaintAffected(config);
    }

    translate({x = 0, y = 0}) {
        this.hide();
        Object.assign(this, {
            x: this.x + x,
            y: this.y + y
        });
        this.show();
    }

    resize({width = 0, height = 0}) {
        this.render({...this, ...{visible: false}});
        Object.assign(this, {
            width: this.width + width,
            height: this.height + height
        });
        this.render();
    }

    hide() {
        this.visible = false;
        this.render();
    }

    show() {
        this.visible = true;
        this.render();
    }

    initTooltip(config) {
        _tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.show(config);
    }
}


/***/ }),

/***/ "./components/context-menu.js":
/*!************************************!*\
  !*** ./components/context-menu.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextMenu": () => /* binding */ ContextMenu
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ "./app.js");




let _instance;

class ContextMenu {
    constructor({id}) {
        this.id = id;
        this.ctxMenuItems = [];
        this.initialWidth = this.initialHeight = 0;
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.throttle)(50);
    }

    /** @returns {ContextMenu} */
    static get instance() {
        return _instance || (i => _instance = i)(new ContextMenu({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     * @returns Object[]
     */
    static render({x, y, width: fullWidth, height: fullHeight, initialWidth: width, initialHeight: height, ctxMenuItems}, ctx) {
        ctx.fillRect(x, y, fullWidth, fullHeight);
        if (!ctxMenuItems.length) return [];

        ctx.save();
            ctx.font = '10px/1 sans-serif';
            const {width: arrowWidth, actualBoundingBoxAscent: arrowHeight} = ctx.measureText('\u25b6');
            const {collection} = ctxMenuItems.reduce(function recurse({x, y, width, visible, collection}, {type, title, highlighted, disabled = false, children = []}, idx) {
                ctx.font = '12px/normal sans-serif';
                const {width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(title);
                const area = {x, y: y + (fontHeight + 10) * idx, width, height: fontHeight + 10};
                const returnValue = {x, y, width, visible,
                    collection: [
                        ...collection,
                        ...[{
                            ...area,
                            ...{
                                type, title, highlighted, disabled,
                                children: children.reduce(recurse, {
                                    x: area.x + area.width,
                                    y: area.y,
                                    width: children.reduce(ContextMenu.calculateMaxWidth, {ctx, maxWidth: 0}).maxWidth,
                                    visible: highlighted,
                                    collection: []
                                }).collection
                            }
                        }]
                    ]
                };
                if (!visible) return returnValue;
                ctx.fillStyle = highlighted ? '#91b5c8' : '#d0d0d0';
                ctx.fillRect.apply(ctx, Object.values(area));
                ctx.fillStyle = disabled ? '#9d9d9d' : '#181818';
                ctx.font = '12px/normal sans-serif';
                ctx.fillText(title, area.x + 10, area.y + area.height - 5);
                if (!children.length) return returnValue;

                ctx.font = '10px/1 sans-serif';
                ctx.fillText('\u25b6', area.x + area.width - arrowWidth - 2, area.y + area.height / 2 + arrowHeight / 2);
                return returnValue;
            }, {x, y, width, visible: true, collection: []});
        ctx.restore();
        return collection;
    }

    static findItemUnderPointer({x, y, right = 0, bottom = 0, highlighted}, item) {
        let wasHighlighted = item.highlighted, hasHighlightedChild;
        item.highlighted = !item.disabled && (
            item.x <= x &&
            item.y <= y &&
            (item.x + item.width) > x &&
            (item.y + item.height) > y
        );
        if (item.highlighted || wasHighlighted) {
            ({highlighted: hasHighlightedChild, right, bottom} = item.children.reduce(ContextMenu.findItemUnderPointer, {x, y, right, bottom}));
        }
        item.highlighted = item.highlighted || hasHighlightedChild;
        return {
            x, y,
            right: Math.max(right, item.x + item.width),
            bottom: Math.max(bottom, item.y + item.height),
            highlighted: item.highlighted || highlighted
        };
    }

    static calculateMaxWidth({ctx, maxWidth}, {title}) {
        return {ctx, maxWidth: Math.floor(Math.max(maxWidth, ctx.measureText(title).width + 30))};
    }

    onMouseUp() {}

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    onMouseDown({x: clickX, y: clickY}) {
        this.handleEvent({offsetX: clickX, offsetY: clickY});
        const {found} = this.ctxMenuItems.reduce(function recurse({zIndex: highestZIndex, found}, item) {
            const {x, y, width, height, zIndex = 1, highlighted, children = []} = item;
            return (
                zIndex > highestZIndex &&
                highlighted &&
                x < clickX &&
                y < clickY &&
                (x + width) > clickX &&
                (y + height) > clickY && {zIndex, found: item}
            ) || children.reduce(recurse, {zIndex: highestZIndex, found});
        }, {zIndex: -1, found: null});
        found && found.type && (found.type() || this.hide());
    }

    onBlur() {
        this.hide();
    }

    show({x, y, ctxMenuConfig: ctxMenuItems}) {
        if (!ctxMenuItems) return;
        Object.assign(this, {x, y, zIndex: Infinity, ctxMenuItems});
        ({maxWidth: this.initialWidth, maxWidth: this.width} = ctxMenuItems.reduce(ContextMenu.calculateMaxWidth, {ctx: _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx, maxWidth: 0}));
        this.render();
        this.height = this.initialHeight = this.ctxMenuItems.reduce((totalHeight, {height}) => totalHeight += height, 0);
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.assignLastActivated(this);
    }

    hide() {
        Object.assign(this, {zIndex: -1, ctxMenuItems: []});
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected(this);
        Object.assign(this, {x: -Infinity, y: -Infinity, width: 0, height: 0});
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.ctxMenuItems = ContextMenu.render(this, _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx);
    }

    highlightItems({x, y}) {
        const {width, height} = this;
        const {right, bottom} = this.ctxMenuItems.reduce(ContextMenu.findItemUnderPointer, {x, y, right: 0, bottom: 0});
        this.render();
        this.width = right - this.x;
        this.height = bottom - this.y;
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected({...this, ...{width, height, zIndex: -1}});
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.throttle(this.highlightItems.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/date-picker.js":
/*!***********************************!*\
  !*** ./components/date-picker.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DatePicker": () => /* binding */ DatePicker
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




let _instance;

class DatePicker {
    constructor({id}) {
        this.id = id;
        this.opened = false;
        this.currentDate = new Date();
        this.calendarData = null;
        this.observableAreas = {dates: [], rest: []};
        this.initiator = null;
        Object.assign(this, DatePicker.geometric);
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this._init();
    }

    /** @returns {DatePicker} */
    static get instance() {
        return _instance || (i => _instance = i)(new DatePicker({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    static get geometric() {
        return {
            width: 300,
            height: 240
        }
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     * @returns {{year: string, month: string, observableAreas?: Object[], dates: Object[]}}
     */
    static render({x, y, width, height, opened, calendarData: {year, month, dates = []}, currentDate}, ctx) {
        ctx.fillRect(x, y, width, height);
        if (!opened) return {year, month, dates};
        ctx.save();
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#006d99';
            ctx.font = 'bold 16px/1 sans-serif';
            let {width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(month);
            const {width: arrowWidth} = ctx.measureText('\u25B2');
            ctx.translate(10, 8);
            let {e: leftArrowXPos} = ctx.getTransform();
            ctx.fillText('\u25C0', 0, fontHeight + 8);
            ctx.translate(arrowWidth + 10, 0);
            ctx.fillText(month, 0, fontHeight + 8);
            ctx.translate(fontWidth + 10, 0);
            let {e: rightArrowXPos} = ctx.getTransform();
            ctx.fillText('\u25B6', 0, fontHeight + 8);
            let observableAreas = [{
                x: leftArrowXPos,
                y,
                width: arrowWidth,
                height: 30,
                zIndex: 2,
                type: 'decreaseCurrentMonth',
                cursorType: 'pointer'
            }, {
                x: rightArrowXPos,
                y,
                width: arrowWidth,
                height: 30,
                zIndex: 2,
                type: 'increaseCurrentMonth',
                cursorType: 'pointer'
            }];
            ({width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(year));
            ctx.setTransform(1, 0, 0, 1, x + width - fontWidth - arrowWidth * 2 - 30, y + 8);
            ({e: leftArrowXPos} = ctx.getTransform());
            ctx.fillText('\u25C0', 0, fontHeight + 8);
            ctx.translate(arrowWidth + 10, 0);
            ctx.fillText(year, 0, fontHeight + 8);
            ctx.translate(fontWidth + 10, 0);
            ({e: rightArrowXPos} = ctx.getTransform());
            ctx.fillText('\u25B6', 0, fontHeight + 8);
            observableAreas = [
                ...observableAreas,
                ...[{
                    x: leftArrowXPos,
                    y,
                    width: fontWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'decreaseCurrentYear',
                    cursorType: 'pointer'
                }, {
                    x: rightArrowXPos,
                    y,
                    width: fontWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'increaseCurrentYear',
                    cursorType: 'pointer'
                }]
            ];
            const returnValue = {
                year,
                month,
                observableAreas,
                dates: DatePicker.renderCalendarData({
                    x: x + 4,
                    y: y + 40 + 4,
                    width: width - 8,
                    height: height - 40 - 8,
                    data: dates,
                    currentDate
                }, ctx)
            };
        ctx.restore();
        return returnValue;
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     * @returns Object[]
     */
    static renderCalendarData({x, y, width, height, data, currentDate}, ctx) {
        ctx.save();
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.font = '18px sans-serif';
            let xPos = 0, roundedXPos = 0, yPos = 0, roundedYPos = 0, contentWidth;
            const interval = {
                horizontal: width / 7,
                vertical: height / Math.ceil(data.length / 7)
            };
            const fontYPos = Math.round(interval.vertical / 2 + ctx.measureText('0').actualBoundingBoxAscent / 2) - 2;
            const currentDateDate = currentDate.getDate();
            const dataArea = data.reduce((collection, item, i) => {
                if (!item) return [...collection, ...[item]];
                const {date, highlighted} = item;
                const isCurrentSelectedDate = currentDateDate === date;
                xPos = i % 7 * interval.horizontal;
                roundedXPos = Math.round(xPos);
                yPos = xPos ? yPos : (i ? yPos + interval.vertical : yPos);
                roundedYPos = Math.round(yPos);
                ctx.save();
                    ctx.fillStyle = isCurrentSelectedDate ? 'red' : '#003b6e';
                    if (highlighted) {
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                        ctx.shadowBlur = 1;
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                    }
                    ctx.fillRect(roundedXPos, roundedYPos, Math.round(interval.horizontal) - 4, Math.round(interval.vertical) - 4);
                ctx.restore();
                ctx.fillStyle = 'white';
                ({width: contentWidth} = ctx.measureText(date));
                ctx.fillText(date, roundedXPos + Math.round((interval.horizontal - 4) / 2 - contentWidth / 2), roundedYPos + fontYPos);
                return [
                    ...collection,
                    ...[{
                        date,
                        highlighted,
                        x: x + roundedXPos,
                        y: y + roundedYPos,
                        width: Math.round(interval.horizontal) - 4,
                        height: Math.round(interval.vertical) - 4,
                        zIndex: 2,
                        type: 'pickDate',
                        cursorType: 'pointer'
                    }]
                ];
            }, []);
        ctx.restore();
        return dataArea;
    }

    /** @this {DatePicker.prototype} */
    static findItemUnderPointer({x: pointerX, y: pointerY, cursorType: latestKnownCursorType, zIndex: highestZIndex}, area) {
        if (!area) return {x: pointerX, y: pointerY, cursorType: latestKnownCursorType, zIndex: highestZIndex};
        const {x, y, width, height, zIndex} = area;
        const match = zIndex > highestZIndex &&
            x < pointerX &&
            y < pointerY &&
            (x + width) > pointerX &&
            (y + height) > pointerY;
        area.highlighted = match;
        return {...{x: pointerX, y: pointerY}, ...((match && area) || {cursorType: latestKnownCursorType, zIndex: highestZIndex})};
    }

    static calendarBuilder(date) {
        date = new Date(date);
        date.setDate(1);
        const day = 1000 * 60 * 60 * 24;
        let idx = (date.getDay() + 6) % 7;
        const result = {
            year: date.getFullYear(),
            month: new Intl.DateTimeFormat('ru', {month: 'long'})
                .format(date)
                .replace(/^[а-я]/, match => match.toUpperCase())
        };
        const data = [];
        do {
            data[idx++] = {
                date: date.getDate(),
                highlighted: false
            };
            date = new Date(+date + day);
        } while (date.getDate() > 1);
        return {...result, ...{dates: [...data]}};
    }

    _init() {
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onBlur() {
        this.hide();
    }

    onMouseUp() {}

    onMouseDown({x: clickX, y: clickY}) {
        const _find = area => (
            area && area.x < clickX && area.y < clickY && (area.x + area.width) > clickX && (area.y + area.height) > clickY
        );
        const area = this.calendarData.observableAreas.find(_find) || this.calendarData.dates.find(_find) || {type: ''};
        switch (area.type) {
            case 'pickDate':
                this.currentDate.setDate(area.date);
                break;
            case 'increaseCurrentMonth':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'decreaseCurrentMonth':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'increaseCurrentYear':
                this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
                break;
            case 'decreaseCurrentYear':
                this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
                break;
            default:
                return;
        }
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
        this.render();
        this.initiator.setDate(this.currentDate);
    }

    show({x = this.x, y = this.y, initiator}) {
        Object.assign(this, {x, y, zIndex: Infinity, initiator, opened: true});
        this.currentDate = initiator.date || new Date();
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.assignLastActivated(this);
    }

    hide() {
        Object.assign(this, {opened: false, zIndex: -1});
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.repaintAffected(this);
        Object.assign(this, {x: -Infinity, y: -Infinity, initiator: null});
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.calendarData = DatePicker.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
    }

    highlightAreas(pos) {
        ({cursorType: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor} = [
            ...this.calendarData.dates,
            ...this.calendarData.observableAreas
        ].reduce(DatePicker.findItemUnderPointer, {...pos, ...{cursorType: 'initial', zIndex: -1}}));
        this.render();
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.throttle(this.highlightAreas.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/edit-box.js":
/*!********************************!*\
  !*** ./components/edit-box.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditBox": () => /* binding */ EditBox
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _date_picker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./date-picker */ "./components/date-picker.js");





class EditBox extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({width = EditBox.geometric.width, isCalendar = false, date = isCalendar ? new Date() : null, value = isCalendar ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.dateFormat)(date) : '', ...params}) {
        super(params);
        this.name = 'EditBox';
        this.focused = false;
        this.value = value;
        this.date = date;
        this.isCalendar = isCalendar;
        this.htmlInput = null;
        Object.assign(this, EditBox.geometric, {width});
        this.observableAreas = [
            ...(
                isCalendar ? [
                    {
                        x: this.x,
                        y: this.y,
                        width: this.width - this.height,
                        height: this.height,
                        type: 'focus',
                        cursorType: 'text'
                    },
                    {
                        x: this.x + this.width - this.height,
                        y: this.y,
                        width: this.height,
                        height: this.height,
                        zIndex: 1,
                        type: 'showCalendar',
                        cursorType: 'pointer'
                    }
                ] : [
                    {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height,
                        type: 'focus',
                        cursorType: 'text'
                    }
                ]
            )
        ];
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
    }

    static get geometric() {
        return {
            width: 90,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, isCalendar}, ctx) {
        ctx.fillRect(x - 2, y - 2, width + 3, height + 3);
        ctx.save();
            ctx.font = '14px sans-serif';
            ctx.strokeStyle = '#666666';
            ctx.fillStyle = '#dddddd';
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.clip();
                if (value) {
                    ctx.fillStyle = '#1d1d1d';
                    ctx.fillText(value, x + 3, y + height - 4);
                }
            ctx.restore();
            if (!isCalendar) return ctx.restore();

            ctx.font = '18px/1 emoji';
            const fontHeight = ctx.measureText('📆').actualBoundingBoxAscent;
            ctx.fillStyle = '#666666';
            ctx.fillText('📆', x + width - height, y + fontHeight);
        ctx.restore();
    }

    /** @this {EditBox.prototype} */
    static defineCursorType({x, y}) {
        ({cursorType: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor} = (
            this.observableAreas.find(function({x, y, width, height}) {
                return x < this.x && y < this.y && (x + width) > this.x && (y + height) > this.y;
            }, {x, y}) || {cursorType: 'initial'}
        ));
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onBlur() {
        this.focused = false;
        const unsafeValue = this.htmlInput?.value ?? this.value;
        this.isCalendar ?
            /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(unsafeValue) && this.setDate(new Date(unsafeValue)) :
            this.setValue(unsafeValue);
        this.render();
        this.htmlInput && (this.htmlInput.remove() || this.htmlInput.removeEventListener('keydown', this));
    }

    onMouseDown({x, y}) {
        const area = this.observableAreas.find(function({x, y, width, height}) {
            return x < this.x && y < this.y && (x + width) > this.x && (y + height) > this.y;
        }, {x, y});
        if (!area) return;
        switch (area.type) {
            case 'focus':
                this.focus();
                break;
            case 'showCalendar':
                this.showCalendar({x, y});
                break;
            default:
        }
    }

    showCalendar({x, y}) {
        _date_picker__WEBPACK_IMPORTED_MODULE_3__.DatePicker.instance.show({initiator: this, x, y});
    }

    focus() {
        const offset = {
            top: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.offsetTop,
            left: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.offsetLeft
        };
        this.focused = true;
        this.render();
        this.htmlInput = document.createElement('input');
        this.htmlInput.setAttribute('style', Object.entries({
            position: 'absolute',
            top: `${this.y + offset.top}px`,
            left: `${this.x + offset.left}px`,
            width: `${this.isCalendar ? this.width - this.height : this.width}px`,
            font: '14px sans-serif',
            'background-color': '#dddddd',
            border: 'none',
            padding: '2px 0'
        }).map(e => e.join(':')).join(';'));
        this.htmlInput.id = 'html-input-element';
        this.htmlInput.value = this.value;
        document.body.appendChild(this.htmlInput);
        this.htmlInput.focus();
        this.htmlInput.addEventListener('keydown', this);
    }

    setDate(date = this.date) {
        if (!date) return;
        this.date = date;
        this.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.dateFormat)(date);
        this.render();
    }

    setValue(value = this.value) {
        this.value = value;
        this.render();
    }

    render() {
        EditBox.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    handleEvent({type, key, offsetX: x, offsetY: y}) {
        switch (type) {
            case 'keydown':
                switch (key) {
                    case 'Enter':
                        this.onBlur();
                        break;
                    default:
                }
                break;
            case 'mousemove':
                return this.throttle(EditBox.defineCursorType.bind(this), {x, y});
            default:
        }
        this.render();
    }
}


/***/ }),

/***/ "./components/hover.js":
/*!*****************************!*\
  !*** ./components/hover.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hover": () => /* binding */ Hover
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



let _instance;

class Hover {
    constructor({id}) {
        this.id = id;
        this.active = false;
    }

    /** @returns {Hover} */
    static get instance() {
        return _instance || (i => _instance = i)(new Hover({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, active}, ctx) {
        ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
        if (!active) return;
        ctx.save();
            ctx.strokeStyle = '#fd2929';
            ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }

    onContextMenu() {}

    onBlur() {}

    onMouseOver() {}

    onMouseOut() {}

    onMouseDown() {}

    onMouseUp() {}

    show({x, y, width, height, zIndex = 1}) {
        Object.assign(this, {
            x: x - 1,
            y: y - 1,
            width: width + 2,
            height: height + 2,
            zIndex: zIndex - 1,
            active: true
        });
        this.render();
    }

    hide() {
        this.zIndex = -1;
        this.active = false;
        this.render();
        Object.assign(this, {
            x: -Infinity,
            y: -Infinity,
            width: 0,
            height: 0
        });
    }

    render() {
        Hover.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.repaintAffected(this);
    }
}


/***/ }),

/***/ "./components/tooltip.js":
/*!*******************************!*\
  !*** ./components/tooltip.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tooltip": () => /* binding */ Tooltip
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ "./app.js");




let _instance;

class Tooltip {
    constructor({id}) {
        this.id = id;
        this.text = '';
        this.debounce = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.debounce)();
    }

    /** @returns {Tooltip} */
    static get instance() {
        return _instance || (i => _instance = i)(new Tooltip({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, text}, ctx) {
        ctx.fillRect(x, y, width, height);
        if (!text) return;
        ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, 500, height);
            ctx.clip();
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#ffea9f';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = '#323232';
            ctx.fillText(text, x + 10, y + height - 10);
        ctx.restore();
    }

    onContextMenu() {}

    onBlur() {}

    onMouseOver() {}

    onMouseOut() {}

    onMouseDown() {}

    onMouseUp() {}

    show({x, y, tooltipContent}) {
        const {ctx, canvas: {width: canvasWidth}} = _app__WEBPACK_IMPORTED_MODULE_2__.App.instance;
        ctx.save();
            ctx.font = '10px sans-serif';
            const {actualBoundingBoxAscent: contentHeight, width: contentWidth} = ctx.measureText(tooltipContent);
        ctx.restore();
        Object.assign(this, {
            x: x > (canvasWidth - contentWidth - 20) ? x - contentWidth - 20 : x,
            y: y > contentHeight + 20 ? y - contentHeight - 20 : y,
            width: contentWidth + 20,
            height: contentHeight + 20,
            text: tooltipContent,
            zIndex: Number.MAX_SAFE_INTEGER
        });
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.listen('mousemove', this);
    }

    hide() {
        this.zIndex = -1;
        this.text = '';
        this.render();
        Object.assign(this, {
            x: -Infinity,
            y: -Infinity,
            width: 0,
            height: 0
        });
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    translate({x, y}) {
        const {text, zIndex} = this;
        Object.assign(this, {text: '', zIndex: -1});
        this.render();
        Object.assign(this, {...{x, y: y - this.height, text, zIndex}});
        this.render();
    }

    render() {
        Tooltip.render(this, _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx);
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected(this);
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.debounce(this.translate.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/trender.js":
/*!*******************************!*\
  !*** ./components/trender.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Trender": () => /* binding */ Trender
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");





class Trender extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'Trender';
        this.scale = 1;
        this.ctxMenuConfig = [
            {
                title: 'Zoom In',
                callback: function() {
                    this.scale *= 1.1;
                    this.render();
                }
            },
            {
                title: 'Zoom Out',
                callback: function() {
                    this.scale *= 0.9;
                    this.render();
                }
            },
            {
                title: 'Zoom Reset',
                callback: function() {
                    this.scale = 1;
                    this.render();
                }
            }
        ].map(({callback, ...rest}) => ({
            ...rest,
            ...{
                callback: callback.bind(this)
            }
        }));
        this.debounce = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)();
        this._init();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render(config, ctx) {
        const chartMargin = 20;
        const {x, y, width, height, padding, data: {points}} = config;
        const chartArea = {
            x: x + padding[3],
            y: y + padding[0],
            width: width - padding[1] - padding[3],
            height: height - padding[0] - padding[2]
        };
        const {min, max} = Trender.normalizeRange(points);
        const rangeScale = (chartArea.height - chartMargin) / (max - min);
        const zeroLevel = Math.floor((chartArea.y + chartMargin / 2) + max * rangeScale);
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = 'rgba(127, 127, 127, 0.2)';
        ctx.fillRect.apply(ctx, Object.values(chartArea));
        ctx.restore();
        Trender.drawXAxis({...config, ...chartArea}, ctx);
        Trender.drawYAxis({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        Trender.drawData({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        Trender.drawLegend({...config, ...{
            x,
            y: y + height - 40,
            width,
            height: 40
        }}, ctx);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawData({x, y, width, height, padding, scale, data: {points = []}, zeroLevel, rangeScale}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#0000ff';
            ctx.fillStyle = 'white';
            ctx.setTransform(1, 0, 0, 1, x, zeroLevel);
            ctx.beginPath();
            ctx.moveTo(0, (-points[0]?.value || 0) * scale * rangeScale);
            for (let i = 0,
                     length = points.length,
                     step = width / length,
                     scaledValue = -points[i].value * scale * rangeScale,
                     xPos = 0;
                 i < length;
                 xPos += step, scaledValue = (-points[++i]?.value || 0) * scale * rangeScale) {
                ctx.lineTo(xPos, scaledValue);
            }
            ctx.stroke();
            for (let i = 0,
                     length = points.length,
                     step = width / length,
                     scaledValue = -points[i].value * scale * rangeScale,
                     xPos = 0;
                 i < length;
                 xPos += step, scaledValue = (-points[++i]?.value || 0) * scale * rangeScale) {
                ctx.fillRect(xPos - 4, scaledValue - 4, 8, 8);
                ctx.strokeRect(xPos - 4, scaledValue - 4, 8, 8);
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawXAxis({x, y, width, height, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#3c3c3c';
            ctx.fillStyle = '#3c3c3c';
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            ctx.font = '10px sans-serif';
            for (let i = 0,
                    xPos = x,
                    interval = width / points.length,
                    roundedXPos = Math.round(xPos),
                    labelWidth = ctx.measureText(points[0].time).width,
                    labelOffset = Math.round(labelWidth / 2),
                    labelsInterval = Math.ceil((labelWidth + 20) / interval),
                    nextLabelPos = xPos + labelsInterval,
                    isMajorTick = false;
                 i < points.length;
                 i++,
                     xPos += interval,
                     roundedXPos = Math.round(xPos),
                     isMajorTick = !(i % labelsInterval)) {
                ctx.strokeStyle = isMajorTick ? '#3c3c3c' : 'rgba(160, 160, 160, 0.5)';
                ctx.beginPath();
                ctx.moveTo(roundedXPos, isMajorTick ? y + height + 5 : y + height);
                ctx.lineTo(roundedXPos, y);
                ctx.stroke();
                if (!isMajorTick) continue;
                ctx.fillText(points[i].time, roundedXPos - labelOffset, y + height + 20);
                nextLabelPos += labelsInterval;
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawYAxis({x, y, width, height, ticks = 20, majorTicksInterval, zeroLevel, scale, rangeScale, data: {points}}, ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px sans-serif';
        const interval = height / ticks;
        ctx.beginPath();
        ctx.rect(x -100, y, width + 100, height);
        ctx.clip();
        for (let i = 0,
                 yPos = zeroLevel + Math.ceil((y + height - zeroLevel) / interval) * interval,
                 roundedYPos = Math.round(yPos),
                 label = ((zeroLevel - yPos) / rangeScale / scale).toFixed(2),
                isMajorTick = false;
             i < ticks;
             i++,
                yPos -= interval,
                 roundedYPos = Math.round(yPos),
                label = ((zeroLevel - yPos ) / rangeScale / scale).toFixed(2),
                 isMajorTick = Math.abs(yPos - zeroLevel) % (interval * majorTicksInterval) < interval / 2) {
            ctx.strokeStyle = isMajorTick ? '#434343' : 'rgba(160, 160, 160, 0.5)';
            ctx.beginPath();
            ctx.moveTo(isMajorTick ? x - 5 : x, roundedYPos);
            ctx.lineTo(x + width, roundedYPos);
            ctx.stroke();
            if (!isMajorTick) continue;
            ctx.fillText(label, x - ctx.measureText(label).width - 10, roundedYPos);
        }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawLegend({x, y, width, height, data: {name}}, ctx) {
        ctx.save();
            ctx.strokeStyle = 'rgb(0,0,255)';
            ctx.font = 'bold 12px sans-serif';
            const fontHeight = ctx.measureText(name).actualBoundingBoxAscent;
            ctx.setTransform(-1, 0, 0, 1, x + width / 2 - 5, y + height / 2);
            ctx.beginPath();
            ctx.moveTo(0, 4);
            ctx.lineTo(20, 4);
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillRect(6, 0, 8, 8);
            ctx.strokeRect(6, 0, 8, 8);
            ctx.setTransform(1, 0, 0, 1, x + width / 2 + 5, y + height / 2);
            ctx.fillStyle = '#151515';
            ctx.fillText(name, 0, fontHeight - 2);
        ctx.restore();
    }

    static normalizeRange(data) {
        return data.reduce(({min, max, maxNegative, minPositive}, {value}) => (
            {
                min: Math.min(value, min),
                max: Math.max(value, max)
            }
        ), {
            min: Infinity,
            max: -Infinity
        });
    }

    static mockData() {
        const startTime = Date.now() - 1000 * 29;
        return new Array(30)
            .fill(startTime)
            .map((time, idx) => (
                {
                    time: new Date(time + 1000 * idx).toLocaleTimeString(),
                    value: _utils__WEBPACK_IMPORTED_MODULE_2__.sinusoidGen.next().value,
                }
            ));
    }

    static mockNextData() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.dispatch(new CustomEvent('trenderNextTick', {detail: {
            time: new Date().toLocaleTimeString(),
            value: _utils__WEBPACK_IMPORTED_MODULE_2__.sinusoidGen.next().value,
        }}))
    }

    _init() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('trenderNextTick', this);
    }

    onMouseOver() {
    }

    render() {
        Trender.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    handleEvent({detail}) {
        this.data.points.shift();
        this.data.points.push(detail);
        this.render();
    }
}


/***/ }),

/***/ "./components/value-item.js":
/*!**********************************!*\
  !*** ./components/value-item.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValueItem": () => /* binding */ ValueItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



class ValueItem extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({value, ...params}) {
        super(params);
        this.name = 'ValueItem';
        this.value = this.tooltipContent = value;
        this.active = false;
        this.trend = 0;
        this.ctxMenuConfig = [
            {
                title: 'Move',
                children: [
                    {
                        title: 'Horizontally',
                        children: [
                            {
                                title: 'Left',
                                type: this.translate.bind(this, {x: -20})
                            },
                            {
                                title: 'Right',
                                type: this.translate.bind(this, {x: 20})
                            }
                        ]
                    },
                    {
                        title: 'Vertically',
                        children: [
                            {
                                title: 'Up',
                                type: this.translate.bind(this, {y: -20})
                            },
                            {
                                title: 'Down',
                                type: this.translate.bind(this, {y: 20})
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Resize',
                children: [
                    {
                        title: 'X',
                        children: [
                            {
                                title: 'Grow',
                                type: this.resize.bind(this, {x: 20})
                            },
                            {
                                title: 'Shrink',
                                type: this.resize.bind(this, {x: -20})
                            }
                        ]
                    },
                    {
                        title: 'Y',
                        children: [
                            {
                                title: 'Grow',
                                type: this.resize.bind(this, {y: 20})
                            },
                            {
                                title: 'Shrink',
                                type: this.resize.bind(this, {x: -20})
                            }
                        ]
                    }
                ],
                disabled: true
            },
            {
                title: 'Hide',
                type: this.hide.bind(this)
            }
        ];
        Object.assign(this, ValueItem.geometric);
    }

    static get geometric() {
        return {
            width: 30,
            height: 20
        }
    }

    static get randomValue() {
        return (Math.random() * 100).toFixed(2);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, visible, value, trend, active}, ctx) {
        let stack = 0;
        ctx.fillRect(x, y, width, height);
        if (!visible) return;
        ctx.save();
			ctx.fillStyle = '#161616';
			ctx.font = 'bold 12px serif';
			const fontHeight = ctx.measureText(value).actualBoundingBoxAscent;
			if (active) {
				ctx.save();
				stack++;
				if (trend > 0) {
					ctx.fillStyle = '#00FF00';
					ctx.fillRect(x, y, width, height);
					ctx.fillStyle = "black";
				} else if (trend < 0) {
					ctx.fillStyle = '#e50000';
					ctx.fillRect(x, y, width, height);
					ctx.fillStyle = "white";
				}
			}
			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.clip();
			ctx.fillText(value, x + 1, y + fontHeight + 5);
			stack && ctx.restore();
        ctx.restore();
    }

    initRandomChange() {
        setInterval(this.onValueChange.bind(this), 10000 + Math.random() * 60000);
    }

    onMouseDown() {
        super.onMouseDown();
        this.active = true;
        this.render();
    }

    setText(value) {
        this.active = true;
        this.trend = value > this.value ? 1 : (value < this.value ? -1 : 0);
        this.value = this.tooltipContent = value;
        this.render();
        setTimeout(this.blink.bind(this), 200);
    }

    blink() {
        this.active = false;
        this.render();
    }

    onValueChange() {
        this.setText(ValueItem.randomValue);
    }

    render() {
        ValueItem.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/component */ "./components/component.js");
/* harmony import */ var _components_collection_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/collection-item */ "./components/collection-item.js");
/* harmony import */ var _components_tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/tooltip */ "./components/tooltip.js");
/* harmony import */ var _components_value_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/value-item */ "./components/value-item.js");
/* harmony import */ var _components_chart_item__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/chart-item */ "./components/chart-item.js");
/* harmony import */ var _components_edit_box__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/edit-box */ "./components/edit-box.js");
/* harmony import */ var _components_context_menu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/context-menu */ "./components/context-menu.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app */ "./app.js");
/* harmony import */ var _components_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/button */ "./components/button.js");
/* harmony import */ var _components_combo_box__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/combo-box */ "./components/combo-box.js");
/* harmony import */ var _components_trender__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/trender */ "./components/trender.js");
/* harmony import */ var _components_hover__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/hover */ "./components/hover.js");
/* harmony import */ var _components_clock__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/clock */ "./components/clock.js");
/* harmony import */ var _components_date_picker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/date-picker */ "./components/date-picker.js");















const chartConfig = {
    type: 'column',
    padding: [20, 20, 70, 70],
    ticks: 5,
    data: {
        points: _components_chart_item__WEBPACK_IMPORTED_MODULE_4__.ChartItem.mockData(),
        margin: 0.1
    }
};

const trenderConfig = {
    padding: [20, 20, 70, 70],
    ticks: 20,
    majorTicksInterval: 4,
    data: {
        name: 'sin(x)',
        points: _components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender.mockData()
    }
};

const menuItems = [
    {
        title: 'One',
        value: 1,
    },
    {
        title: 'Two',
        value: 2,
    },
    {
        title: 'Three',
        value: 3,
    }
];

const buttonCallback = () => (
    _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.dispatch(new CustomEvent('randomizeChartData'))
);

setInterval(_components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender.mockNextData, 1000);

_app__WEBPACK_IMPORTED_MODULE_7__.App.instance.components = [
    ...[
        new _components_clock__WEBPACK_IMPORTED_MODULE_12__.Clock({y: 0, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId})
    ],
    ..._components_collection_item__WEBPACK_IMPORTED_MODULE_1__.CollectionItem.compose({x: 0, y: 30, cols: 25, rows: 12, gap: 20, ctor: _components_value_item__WEBPACK_IMPORTED_MODULE_3__.ValueItem}),
    ...[
        new _components_edit_box__WEBPACK_IMPORTED_MODULE_5__.EditBox({x: 0, y: 600, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_edit_box__WEBPACK_IMPORTED_MODULE_5__.EditBox({x: 100, y: 600, width: 100, zIndex: 1, isCalendar: true, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_combo_box__WEBPACK_IMPORTED_MODULE_9__.ComboBox({x: 250, y: 600, zIndex: 1, variableName: 'Combobox1', menuItems, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_chart_item__WEBPACK_IMPORTED_MODULE_4__.ChartItem({...{x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - 600, y: 30, width: 600, height: 400, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}, ...chartConfig}),
        new _components_button__WEBPACK_IMPORTED_MODULE_8__.Button({x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - _components_button__WEBPACK_IMPORTED_MODULE_8__.Button.geometric.width, y: 450, zIndex: 1, value: 'Randomize', callback: buttonCallback, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender({...{x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - 600, y: 490, width: 600, height: 400, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}, ...trenderConfig}),
        _components_tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance,
        _components_hover__WEBPACK_IMPORTED_MODULE_11__.Hover.instance,
        _components_context_menu__WEBPACK_IMPORTED_MODULE_6__.ContextMenu.instance,
        _components_date_picker__WEBPACK_IMPORTED_MODULE_13__.DatePicker.instance
    ]
];

_app__WEBPACK_IMPORTED_MODULE_7__.App.instance.render();


/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => /* binding */ debounce,
/* harmony export */   "throttle": () => /* binding */ throttle,
/* harmony export */   "sinusoidGen": () => /* binding */ sinusoidGen,
/* harmony export */   "timeFormat": () => /* binding */ timeFormat,
/* harmony export */   "dateFormat": () => /* binding */ dateFormat
/* harmony export */ });
function debounce(threshold = 100) {
    let timeout = 0;
    return (fn, arg) => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, threshold, arg);
    }
}

function throttle(threshold = 100) {
    let timeout = true;
    setInterval(() => timeout = true, threshold);
    return (fn, arg) => {
        timeout && fn(arg);
        timeout = false;
    };
}

const sinusoidGen = (function* () {
    const period = Math.PI * 2;
    const q = 0.5;
    let _i = 0;
    while (true) yield Math.round(Math.sin(_i++ * q % period) * 10000) / 100;
})();

const timeFormat = (timeFormatter => {
    return time => timeFormatter.format(time);
})(new Intl.DateTimeFormat('ru', {hour: '2-digit', minute: '2-digit', second: '2-digit'}));

const dateFormat = (dateFormatter => {
    return date => dateFormatter.format(date);
})(new Intl.DateTimeFormat('en', {day: '2-digit', month: '2-digit', year: 'numeric'}));




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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QUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzP2I4ZDc2OWI0MjAyZDBiZTVlMWU2Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7Q29tcG9uZW50W119ICovXHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzIyMjIyMic7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyM3YWZmZDEnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IEFwcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgb25Db250ZXh0TWVudShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtDb21wb25lbnRbXX0gY29tcG9uZW50cyAqL1xyXG4gICAgc2V0IGNvbXBvbmVudHMoY29tcG9uZW50cykge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29tcG9uZW50W119ICovXHJcbiAgICBnZXQgY29tcG9uZW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aHJvdHRsZSgpLmJpbmQodW5kZWZpbmVkLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIEFwcC5vbkNvbnRleHRNZW51KTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2goZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmRpc3BhdGNoRXZlbnQoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxpc3RlbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25Nb3VzZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeSwgYnV0dG9ufSA9IGU7XHJcbiAgICAgICAgbGV0IHRvcE1vc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIHpJbmRleCA9IC0xLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPSB0b3BNb3N0LnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAhT2JqZWN0LmlzKHRvcE1vc3QsIHRoaXMubGFzdEFjdGl2YXRlZCkgJiZcclxuICAgICAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIChcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKSB8fCB0aGlzLmxhc3RBY3RpdmF0ZWQub25Nb3VzZU91dCgpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgKFxyXG4gICAgICAgICAgICBidXR0b24gPT09IDIgP1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdC5vbkNvbnRleHRNZW51KHt4LCB5fSkgOiB0b3BNb3N0Lm9uTW91c2VEb3duKHt4LCB5fSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlKHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdCA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgekluZGV4ID0gdG9wTW9zdC56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgIU9iamVjdC5pcyh0b3BNb3N0LCB0aGlzLmxhc3RIb3ZlcmVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkLm9uTW91c2VPdXQoKTtcclxuICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkID0gdG9wTW9zdDtcclxuICAgICAgICB0b3BNb3N0ICYmIHRvcE1vc3Qub25Nb3VzZU92ZXIoe3gsIHl9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblRvdWNoU3RhcnQoZSkge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckNvbnRleHRNZW51RGVsYXkgPSBzZXRUaW1lb3V0KHRoaXMub25Ub3VjaENvbnRleHRNZW51LmJpbmQodGhpcyksIDUwMCwgZSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRvdWNoQ29udGV4dE1lbnUoe3RvdWNoZXM6IFt7cGFnZVgsIHBhZ2VZfV19KSB7XHJcbiAgICAgICAgY29uc3Qge29mZnNldFRvcCwgb2Zmc2V0TGVmdH0gPSB0aGlzLmNhbnZhcztcclxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKHtcclxuICAgICAgICAgICAgb2Zmc2V0WDogTWF0aC5yb3VuZChwYWdlWCAtIG9mZnNldExlZnQpLFxyXG4gICAgICAgICAgICBvZmZzZXRZOiBNYXRoLnJvdW5kKHBhZ2VZIC0gb2Zmc2V0VG9wKSxcclxuICAgICAgICAgICAgYnV0dG9uOiAyLFxyXG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdCgpIHt9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkxhc3RBY3RpdmF0ZWQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwYWludEFmZmVjdGVkKHtpZCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLmlkICE9PSBpZCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPj0geSAmJiBpdGVtc1tpXS55IDw9ICh5ICsgaGVpZ2h0KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDw9IHkgJiYgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID49IHlcclxuICAgICAgICAgICAgICAgICAgICApICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA+PSB4ICYmIGl0ZW1zW2ldLnggPD0gKHggKyB3aWR0aCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8PSB4ICYmIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID49IHhcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5wb2ludGVyQ29udGV4dE1lbnVEZWxheSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZT0gJ0FwcGx5JywgY2FsbGJhY2sgPSAoKSA9PiB7fSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0J1dHRvbic7XHJcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSAxMjtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBCdXR0b24uZ2VvbWV0cmljLCB7d2lkdGg6IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggKyAyMH0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy54ICs9IEJ1dHRvbi5nZW9tZXRyaWMud2lkdGggLSB0aGlzLndpZHRoIC0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemUsIHByZXNzZWQsIHJhZGl1cyA9IDN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDMsIHkgLSAzLCB3aWR0aCArIDksIGhlaWdodCArIDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2EyYTJhMic7XHJcbiAgICAgICAgICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjYjFiMWIxJztcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDEyNywxMjcsMTI3LDAuNyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHksIHggKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgMiwgeSArIDIgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiwgeSArIDIgKyByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyY1RvKHggKyAyLCB5ICsgMiwgeCArIDIgKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAyICsgd2lkdGggLSByYWRpdXMsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzUzNTM1JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAxMCwgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEJ1dHRvbi5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDaGFydEl0ZW0nO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuZGF0YURyYXdBcmVhTWFwID0gW107XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDEuMSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnNldFNjYWxlLmJpbmQodGhpcywgMC45KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNldFNjYWxlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IENoYXJ0SXRlbS5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIENoYXJ0SXRlbS5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIHJldHVybiBDaGFydEl0ZW0uZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXSwgbWFyZ2luID0gMC4yfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YURyYXdBcmVhTWFwID0gWy4uLnBvaW50c107XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJXaWR0aCA9IHN0ZXAgKiAoMSAtIG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSBzdGVwIC8gMiAtIGJhcldpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3R5bGUgPSBwb2ludHNbaV0udmFsdWUgPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAocG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyM4MTAwMDAnIDogJyNmZjAwMDAnKTtcclxuICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhQb3MsIDAsIGJhcldpZHRoLCAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGRhdGFEcmF3QXJlYU1hcFtpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhRHJhd0FyZWFNYXBbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4UG9zICsgeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4oemVyb0xldmVsLCB6ZXJvTGV2ZWwgKyBiYXJIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFyV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhRHJhd0FyZWFNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoICAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4ICsgc3RlcCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgICBpIDwgcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCwgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHJvdW5kZWRYUG9zLCB5ICsgaGVpZ2h0ICsgNSk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHJvdW5kZWRYUG9zLCB5KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHJvdW5kZWRYUG9zICsgNSwgeSArIGhlaWdodCArIGN0eC5tZWFzdXJlVGV4dChwb2ludHNbaV0uY2F0ZWdvcnkpLndpZHRoICsgNSlcclxuICAgICAgICAgICAgICAgICAgICBjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBvaW50c1tpXS5jYXRlZ29yeSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdZQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGlja3MgPSA1LCB6ZXJvTGV2ZWwsIHNjYWxlLCByYW5nZVNjYWxlLCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5mbG9vcihoZWlnaHQgLyB0aWNrcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCAtIE1hdGguYWJzKHplcm9MZXZlbCAtIHkgLSBoZWlnaHQpICUgaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICBpIDwgdGlja3M7XHJcbiAgICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICBpKyssIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zICkgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCAtIDUsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCB5UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZVJhbmdlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoKHttaW4sIG1heCwgbWF4TmVnYXRpdmUsIG1pblBvc2l0aXZlfSwge3ZhbHVlfSkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtaW46IE1hdGgubWluKHZhbHVlLCBtaW4pLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBNYXRoLm1heCh2YWx1ZSwgbWF4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKSwge1xyXG4gICAgICAgICAgICBtaW46IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXg6IC1JbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKS5maWxsKFsxLCAtMV0pLm1hcCgoYmksIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogYENhdGVnb3J5JHtpZHggKyAxfWAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAqIGJpW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSldKSAvIDEwMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigncmFuZG9taXplQ2hhcnREYXRhJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFNjYWxlKCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlKHNjYWxlID0gMSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgKj0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBsZXQgaGlnaGxpZ2h0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICBzdXBlci5vbk1vdXNlT3V0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eDogaXRlbVgsIHk6IGl0ZW1ZLCB3aWR0aCwgaGVpZ2h0fSA9IGk7XHJcbiAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSBpdGVtWCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1YICsgd2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgICAgIGlmIChpLmhpZ2hsaWdodGVkKSBoaWdobGlnaHRlZCA9IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9IGhpZ2hsaWdodGVkLnZhbHVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ue3gsIHl9fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmFuZG9taXplQ2hhcnREYXRhJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wb2ludHMgPSBDaGFydEl0ZW0ubW9ja0RhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge3RpbWVGb3JtYXR9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG9jayBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDbG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMjA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDbG9jay5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBmb250U2l6ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbChjdHgubWVhc3VyZVRleHQodGhpcy52YWx1ZSkud2lkdGgpICsgMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCA9IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnBvc30pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ2xvY2sucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL3ZhbHVlLWl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uSXRlbSB7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIHN0YXRpYyBjb21wb3NlKHt4LCB5LCBjb2xzLCByb3dzLCBnYXAgPSAyMCwgY3Rvcn0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjdG9yLmdlb21ldHJpYztcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KHJvd3MpLmZpbGwoQXBwLmluc3RhbmNlLmN0eCkucmVkdWNlKChyZXN1bHQsIGN0eCwgcm93KSA9PiAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcclxuICAgICAgICAgICAgICAgIC4uLm5ldyBBcnJheShjb2xzKS5maWxsKGN0b3IpLm1hcCgoY3RvciwgY29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2lkLCB4UG9zLCB5UG9zLCB6SW5kZXhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQubmV4dElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ICsgY29sICogKHdpZHRoICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSArIHJvdyAqIChoZWlnaHQgKyBnYXApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocm93ICsgMSkgKiAoY29sICsgMSlcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3Ioe2lkLCB4OiB4UG9zLCB5OiB5UG9zLCB2YWx1ZTogVmFsdWVJdGVtLnJhbmRvbVZhbHVlLCB6SW5kZXgsIGN0eH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRSYW5kb21DaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSwgW10pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21ib0JveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBDb21ib0JveC5nZW9tZXRyaWMud2lkdGgsIG1lbnVJdGVtcyA9IFtdLCB2YXJpYWJsZU5hbWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDb21ib0JveCc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIENvbWJvQm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QuLi4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IG1lbnVJdGVtcy5tYXAoKGksIGlkeCkgPT4gKHtcclxuICAgICAgICAgICAgLi4uaSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy5oZWlnaHQgKyBpZHggKiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB3aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bGxIZWlnaHQgPSB0aGlzLmhlaWdodCArIG1lbnVJdGVtcy5sZW5ndGggKiAyMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGZ1bGxIZWlnaHQsIG9wZW5lZCwgdmFyaWFibGU6IHt0aXRsZX0sIG1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gJyM4MDgwODAnO1xyXG4gICAgICAgIGNvbnN0IGZvbnRDb2xvciA9ICcjMjQyNDI0JztcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2M4YzhjOCc7XHJcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0Q29sb3IgPSAnIzhkOGQ4ZCc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBmdWxsSGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB4ICsgd2lkdGggLSBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgMywgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICsgd2lkdGggLSBoZWlnaHQsIHksIGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG9wZW5lZCA/ICdcXHUyNUIyJyA6ICdcXHUyNUJDJywgeCArIHdpZHRoIC0gaGVpZ2h0IC8gMiAtIDUsIHkgKyBoZWlnaHQgLSA2KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gbWVudUl0ZW1zLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgIHRleHRZUG9zID0gKGhlaWdodCAtIGZvbnRIZWlnaHQpIC8gMiArIGZvbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDsgaSsrLCB5UG9zID0geSArIGhlaWdodCArIDEgKyBoZWlnaHQgKiBpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbWVudUl0ZW1zW2ldLmhpZ2hsaWdodGVkID8gaGlnaGxpZ2h0Q29sb3IgOiBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeVBvcywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSwgeCArIDMsIHlQb3MgKyB0ZXh0WVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHt4LCB5fSkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPiB4IHx8XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA+IHkgfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpIDwgeCB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpIDwgeVxyXG4gICAgICAgICkgPyAnaW5pdGlhbCcgOiAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oe3gsIHl9KTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLm9wZW5lZCA/IChcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpIHx8XHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTWVudVNlbGVjdCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA8IHggJiZcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55IDwgeSAmJlxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPiB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5tZW51SXRlbXMuZmluZCgoe3k6IG1lbnVZLCBoZWlnaHR9KSA9PiAoXHJcbiAgICAgICAgICAgIHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgbWVudVkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnggKyB0aGlzLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKG1lbnVZICsgaGVpZ2h0KSA+IHlcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLmhpZGVNZW51KCk7XHJcbiAgICAgICAgc2VsZWN0ZWRJdGVtICYmICh0aGlzLnNldFZhbHVlKHNlbGVjdGVkSXRlbSkgfHwgdGhpcy5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZU1lbnUoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBDb21ib0JveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHsuLi50aGlzLCAuLi57aGVpZ2h0OiB0aGlzLmZ1bGxIZWlnaHR9fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3k6IGl0ZW1ZLCBoZWlnaHR9ID0gaTtcclxuICAgICAgICAgICAgaS5oaWdobGlnaHRlZCA9IHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1ZIDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh7dGl0bGUsIHZhbHVlfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52YXJpYWJsZSwge3RpdGxlLCB2YWx1ZX0pO1xyXG4gICAgICAgIC8vIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3VwZGF0ZUxvY2FsVmFyaWFibGUnLCB7ZGV0YWlsOiB0aGlzLnZhcmlhYmxlfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBzd2l0Y2ggKGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1lbnVTZWxlY3QoZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCBlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb250ZXh0LW1lbnVcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcbmltcG9ydCB7SG92ZXJ9IGZyb20gXCIuL2hvdmVyXCI7XHJcblxyXG5sZXQgX2lkID0gMDtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW107XHJcbiAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9ICcnO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGFyYW1zKTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gMDtcclxuICAgICAgICB0aGlzLmZpcnN0UmVuZGVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5leHRJZCgpIHtcclxuICAgICAgICByZXR1cm4gKF9pZCsrKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUocG9zKSB7XHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2Uuc2hvdyh7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLnNob3codGhpcyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweC8xIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJ1xcdTI1YjYnKTtcclxuICAgICAgICAgICAgY29uc3Qge2NvbGxlY3Rpb259ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt4LCB5LCB3aWR0aCwgdmlzaWJsZSwgY29sbGVjdGlvbn0sIHt0eXBlLCB0aXRsZSwgaGlnaGxpZ2h0ZWQsIGRpc2FibGVkID0gZmFsc2UsIGNoaWxkcmVuID0gW119LCBpZHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHgvbm9ybWFsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4L25vcm1hbCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjViNicsIGFyZWEueCArIGFyZWEud2lkdGggLSBhcnJvd1dpZHRoIC0gMiwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLyAyICsgYXJyb3dIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfSwge3gsIHksIHdpZHRoLCB2aXNpYmxlOiB0cnVlLCBjb2xsZWN0aW9uOiBbXX0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4LCB5LCByaWdodCA9IDAsIGJvdHRvbSA9IDAsIGhpZ2hsaWdodGVkfSwgaXRlbSkge1xyXG4gICAgICAgIGxldCB3YXNIaWdobGlnaHRlZCA9IGl0ZW0uaGlnaGxpZ2h0ZWQsIGhhc0hpZ2hsaWdodGVkQ2hpbGQ7XHJcbiAgICAgICAgaXRlbS5oaWdobGlnaHRlZCA9ICFpdGVtLmRpc2FibGVkICYmIChcclxuICAgICAgICAgICAgaXRlbS54IDw9IHggJiZcclxuICAgICAgICAgICAgaXRlbS55IDw9IHkgJiZcclxuICAgICAgICAgICAgKGl0ZW0ueCArIGl0ZW0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAoaXRlbS55ICsgaXRlbS5oZWlnaHQpID4geVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgd2FzSGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgKHtoaWdobGlnaHRlZDogaGFzSGlnaGxpZ2h0ZWRDaGlsZCwgcmlnaHQsIGJvdHRvbX0gPSBpdGVtLmNoaWxkcmVuLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0LCBib3R0b219KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0uaGlnaGxpZ2h0ZWQgPSBpdGVtLmhpZ2hsaWdodGVkIHx8IGhhc0hpZ2hsaWdodGVkQ2hpbGQ7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4KHJpZ2h0LCBpdGVtLnggKyBpdGVtLndpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChib3R0b20sIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgaGlnaGxpZ2h0ZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVNYXhXaWR0aCh7Y3R4LCBtYXhXaWR0aH0sIHt0aXRsZX0pIHtcclxuICAgICAgICByZXR1cm4ge2N0eCwgbWF4V2lkdGg6IE1hdGguZmxvb3IoTWF0aC5tYXgobWF4V2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0aXRsZSkud2lkdGggKyAzMCkpfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudCh7b2Zmc2V0WDogY2xpY2tYLCBvZmZzZXRZOiBjbGlja1l9KTtcclxuICAgICAgICBjb25zdCB7Zm91bmR9ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKGZ1bmN0aW9uIHJlY3Vyc2Uoe3pJbmRleDogaGlnaGVzdFpJbmRleCwgZm91bmR9LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxLCBoaWdobGlnaHRlZCwgY2hpbGRyZW4gPSBbXX0gPSBpdGVtO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgekluZGV4ID4gaGlnaGVzdFpJbmRleCAmJlxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHggPCBjbGlja1ggJiZcclxuICAgICAgICAgICAgICAgIHkgPCBjbGlja1kgJiZcclxuICAgICAgICAgICAgICAgICh4ICsgd2lkdGgpID4gY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICAoeSArIGhlaWdodCkgPiBjbGlja1kgJiYge3pJbmRleCwgZm91bmQ6IGl0ZW19XHJcbiAgICAgICAgICAgICkgfHwgY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSk7XHJcbiAgICAgICAgfSwge3pJbmRleDogLTEsIGZvdW5kOiBudWxsfSk7XHJcbiAgICAgICAgZm91bmQgJiYgZm91bmQudHlwZSAmJiAoZm91bmQudHlwZSgpIHx8IHRoaXMuaGlkZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgY3R4TWVudUNvbmZpZzogY3R4TWVudUl0ZW1zfSkge1xyXG4gICAgICAgIGlmICghY3R4TWVudUl0ZW1zKSByZXR1cm47XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eCwgeSwgekluZGV4OiBJbmZpbml0eSwgY3R4TWVudUl0ZW1zfSk7XHJcbiAgICAgICAgKHttYXhXaWR0aDogdGhpcy5pbml0aWFsV2lkdGgsIG1heFdpZHRoOiB0aGlzLndpZHRofSA9IGN0eE1lbnVJdGVtcy5yZWR1Y2UoQ29udGV4dE1lbnUuY2FsY3VsYXRlTWF4V2lkdGgsIHtjdHg6IEFwcC5pbnN0YW5jZS5jdHgsIG1heFdpZHRoOiAwfSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmluaXRpYWxIZWlnaHQgPSB0aGlzLmN0eE1lbnVJdGVtcy5yZWR1Y2UoKHRvdGFsSGVpZ2h0LCB7aGVpZ2h0fSkgPT4gdG90YWxIZWlnaHQgKz0gaGVpZ2h0LCAwKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3pJbmRleDogLTEsIGN0eE1lbnVJdGVtczogW119KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHdpZHRoOiAwLCBoZWlnaHQ6IDB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IENvbnRleHRNZW51LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHtyaWdodCwgYm90dG9tfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0OiAwLCBib3R0b206IDB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSByaWdodCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGJvdHRvbSAtIHRoaXMueTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHsuLi50aGlzLCAuLi57d2lkdGgsIGhlaWdodCwgekluZGV4OiAtMX19KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0SXRlbXMuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7dGhyb3R0bGV9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSB7ZGF0ZXM6IFtdLCByZXN0OiBbXX07XHJcbiAgICAgICAgdGhpcy5pbml0aWF0b3IgPSBudWxsO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgRGF0ZVBpY2tlci5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0RhdGVQaWNrZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IERhdGVQaWNrZXIoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjQwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogc3RyaW5nLCBtb250aDogc3RyaW5nLCBvYnNlcnZhYmxlQXJlYXM/OiBPYmplY3RbXSwgZGF0ZXM6IE9iamVjdFtdfX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgb3BlbmVkLCBjYWxlbmRhckRhdGE6IHt5ZWFyLCBtb250aCwgZGF0ZXMgPSBbXX0sIGN1cnJlbnREYXRlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghb3BlbmVkKSByZXR1cm4ge3llYXIsIG1vbnRoLCBkYXRlc307XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB5KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA2ZDk5JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNnB4LzEgc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGxldCB7d2lkdGg6IGZvbnRXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGZvbnRIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KG1vbnRoKTtcclxuICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBhcnJvd1dpZHRofSA9IGN0eC5tZWFzdXJlVGV4dCgnXFx1MjVCMicpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKDEwLCA4KTtcclxuICAgICAgICAgICAgbGV0IHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCdcXHUyNUMwJywgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGFycm93V2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChtb250aCwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgbGV0IHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVCNicsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGVBcmVhcyA9IFt7XHJcbiAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkZWNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgeDogcmlnaHRBcnJvd1hQb3MsXHJcbiAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgKHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoeWVhcikpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHggKyB3aWR0aCAtIGZvbnRXaWR0aCAtIGFycm93V2lkdGggKiAyIC0gMzAsIHkgKyA4KTtcclxuICAgICAgICAgICAgKHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVDMCcsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShhcnJvd1dpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoeWVhciwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgKHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QjYnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgICAgIC4uLm9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogbGVmdEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmb250V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudFllYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHJpZ2h0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZvbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50WWVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIHllYXIsXHJcbiAgICAgICAgICAgICAgICBtb250aCxcclxuICAgICAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIGRhdGVzOiBEYXRlUGlja2VyLnJlbmRlckNhbGVuZGFyRGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogeCArIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSArIDQwICsgNCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gNDAgLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlXHJcbiAgICAgICAgICAgICAgICB9LCBjdHgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMgT2JqZWN0W11cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNhbGVuZGFyRGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxOHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBsZXQgeFBvcyA9IDAsIHJvdW5kZWRYUG9zID0gMCwgeVBvcyA9IDAsIHJvdW5kZWRZUG9zID0gMCwgY29udGVudFdpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHtcclxuICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHdpZHRoIC8gNyxcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBoZWlnaHQgLyBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyA3KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBmb250WVBvcyA9IE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwgLyAyICsgY3R4Lm1lYXN1cmVUZXh0KCcwJykuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQgLyAyKSAtIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlRGF0ZSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YUFyZWEgPSBkYXRhLnJlZHVjZSgoY29sbGVjdGlvbiwgaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gWy4uLmNvbGxlY3Rpb24sIC4uLltpdGVtXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7ZGF0ZSwgaGlnaGxpZ2h0ZWR9ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ3VycmVudFNlbGVjdGVkRGF0ZSA9IGN1cnJlbnREYXRlRGF0ZSA9PT0gZGF0ZTtcclxuICAgICAgICAgICAgICAgIHhQb3MgPSBpICUgNyAqIGludGVydmFsLmhvcml6b250YWw7XHJcbiAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICB5UG9zID0geFBvcyA/IHlQb3MgOiAoaSA/IHlQb3MgKyBpbnRlcnZhbC52ZXJ0aWNhbCA6IHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gaXNDdXJyZW50U2VsZWN0ZWREYXRlID8gJ3JlZCcgOiAnIzAwM2I2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3Qocm91bmRlZFhQb3MsIHJvdW5kZWRZUG9zLCBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCwgTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCkgLSA0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICh7d2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQoZGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGRhdGUsIHJvdW5kZWRYUG9zICsgTWF0aC5yb3VuZCgoaW50ZXJ2YWwuaG9yaXpvbnRhbCAtIDQpIC8gMiAtIGNvbnRlbnRXaWR0aCAvIDIpLCByb3VuZGVkWVBvcyArIGZvbnRZUG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAuLi5be1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeCArIHJvdW5kZWRYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB5ICsgcm91bmRlZFlQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsKSAtIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpY2tEYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIH0sIFtdKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhQXJlYTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHRoaXMge0RhdGVQaWNrZXIucHJvdG90eXBlfSAqL1xyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fSwgYXJlYSkge1xyXG4gICAgICAgIGlmICghYXJlYSkgcmV0dXJuIHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fTtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSA9IGFyZWE7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB6SW5kZXggPiBoaWdoZXN0WkluZGV4ICYmXHJcbiAgICAgICAgICAgIHggPCBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICB5IDwgcG9pbnRlclkgJiZcclxuICAgICAgICAgICAgKHggKyB3aWR0aCkgPiBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICAoeSArIGhlaWdodCkgPiBwb2ludGVyWTtcclxuICAgICAgICBhcmVhLmhpZ2hsaWdodGVkID0gbWF0Y2g7XHJcbiAgICAgICAgcmV0dXJuIHsuLi57eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZfSwgLi4uKChtYXRjaCAmJiBhcmVhKSB8fCB7Y3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9KX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNhbGVuZGFyQnVpbGRlcihkYXRlKSB7XHJcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZSgxKTtcclxuICAgICAgICBjb25zdCBkYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIGxldCBpZHggPSAoZGF0ZS5nZXREYXkoKSArIDYpICUgNztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcclxuICAgICAgICAgICAgbW9udGg6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHttb250aDogJ2xvbmcnfSlcclxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZGF0ZSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eW9CwLdGPXS8sIG1hdGNoID0+IG1hdGNoLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBkYXRhW2lkeCsrXSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IGRhdGUuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSArIGRheSk7XHJcbiAgICAgICAgfSB3aGlsZSAoZGF0ZS5nZXREYXRlKCkgPiAxKTtcclxuICAgICAgICByZXR1cm4gey4uLnJlc3VsdCwgLi4ue2RhdGVzOiBbLi4uZGF0YV19fTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgY29uc3QgX2ZpbmQgPSBhcmVhID0+IChcclxuICAgICAgICAgICAgYXJlYSAmJiBhcmVhLnggPCBjbGlja1ggJiYgYXJlYS55IDwgY2xpY2tZICYmIChhcmVhLnggKyBhcmVhLndpZHRoKSA+IGNsaWNrWCAmJiAoYXJlYS55ICsgYXJlYS5oZWlnaHQpID4gY2xpY2tZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5jYWxlbmRhckRhdGEub2JzZXJ2YWJsZUFyZWFzLmZpbmQoX2ZpbmQpIHx8IHRoaXMuY2FsZW5kYXJEYXRhLmRhdGVzLmZpbmQoX2ZpbmQpIHx8IHt0eXBlOiAnJ307XHJcbiAgICAgICAgc3dpdGNoIChhcmVhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAncGlja0RhdGUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXREYXRlKGFyZWEuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaW5jcmVhc2VDdXJyZW50TW9udGgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRNb250aCh0aGlzLmN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWNyZWFzZUN1cnJlbnRNb250aCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldE1vbnRoKHRoaXMuY3VycmVudERhdGUuZ2V0TW9udGgoKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2luY3JlYXNlQ3VycmVudFllYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRGdWxsWWVhcih0aGlzLmN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCkgKyAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWNyZWFzZUN1cnJlbnRZZWFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RnVsbFllYXIodGhpcy5jdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhdG9yLnNldERhdGUodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyh7eCA9IHRoaXMueCwgeSA9IHRoaXMueSwgaW5pdGlhdG9yfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3gsIHksIHpJbmRleDogSW5maW5pdHksIGluaXRpYXRvciwgb3BlbmVkOiB0cnVlfSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RGF0ZSA9IGluaXRpYXRvci5kYXRlIHx8IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7b3BlbmVkOiBmYWxzZSwgekluZGV4OiAtMX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgaW5pdGlhdG9yOiBudWxsfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRBcmVhcyhwb3MpIHtcclxuICAgICAgICAoe2N1cnNvclR5cGU6IEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yfSA9IFtcclxuICAgICAgICAgICAgLi4udGhpcy5jYWxlbmRhckRhdGEuZGF0ZXMsXHJcbiAgICAgICAgICAgIC4uLnRoaXMuY2FsZW5kYXJEYXRhLm9ic2VydmFibGVBcmVhc1xyXG4gICAgICAgIF0ucmVkdWNlKERhdGVQaWNrZXIuZmluZEl0ZW1VbmRlclBvaW50ZXIsIHsuLi5wb3MsIC4uLntjdXJzb3JUeXBlOiAnaW5pdGlhbCcsIHpJbmRleDogLTF9fSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEFyZWFzLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge2RhdGVGb3JtYXQsIHRocm90dGxlfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9kYXRlLXBpY2tlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVkaXRCb3ggZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3dpZHRoID0gRWRpdEJveC5nZW9tZXRyaWMud2lkdGgsIGlzQ2FsZW5kYXIgPSBmYWxzZSwgZGF0ZSA9IGlzQ2FsZW5kYXIgPyBuZXcgRGF0ZSgpIDogbnVsbCwgdmFsdWUgPSBpc0NhbGVuZGFyID8gZGF0ZUZvcm1hdChkYXRlKSA6ICcnLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnRWRpdEJveCc7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5pc0NhbGVuZGFyID0gaXNDYWxlbmRhcjtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dCA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFZGl0Qm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSBbXHJcbiAgICAgICAgICAgIC4uLihcclxuICAgICAgICAgICAgICAgIGlzQ2FsZW5kYXIgPyBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Nob3dDYWxlbmRhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0gOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb2N1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDkwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgaXNDYWxlbmRhcn0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgMywgaGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTRweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNkZGRkZGQnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWQxZDFkJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAzLCB5ICsgaGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNDYWxlbmRhcikgcmV0dXJuIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxOHB4LzEgZW1vamknO1xyXG4gICAgICAgICAgICBjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KCfwn5OGJykuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzY2NjY2Nic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgn8J+ThicsIHggKyB3aWR0aCAtIGhlaWdodCwgeSArIGZvbnRIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEB0aGlzIHtFZGl0Qm94LnByb3RvdHlwZX0gKi9cclxuICAgIHN0YXRpYyBkZWZpbmVDdXJzb3JUeXBlKHt4LCB5fSkge1xyXG4gICAgICAgICh7Y3Vyc29yVHlwZTogQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3J9ID0gKFxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcy5maW5kKGZ1bmN0aW9uKHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPCB0aGlzLnggJiYgeSA8IHRoaXMueSAmJiAoeCArIHdpZHRoKSA+IHRoaXMueCAmJiAoeSArIGhlaWdodCkgPiB0aGlzLnk7XHJcbiAgICAgICAgICAgIH0sIHt4LCB5fSkgfHwge2N1cnNvclR5cGU6ICdpbml0aWFsJ31cclxuICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHVuc2FmZVZhbHVlID0gdGhpcy5odG1sSW5wdXQ/LnZhbHVlID8/IHRoaXMudmFsdWU7XHJcbiAgICAgICAgdGhpcy5pc0NhbGVuZGFyID9cclxuICAgICAgICAgICAgL15cXGR7MSwyfVxcL1xcZHsxLDJ9XFwvXFxkezR9JC8udGVzdCh1bnNhZmVWYWx1ZSkgJiYgdGhpcy5zZXREYXRlKG5ldyBEYXRlKHVuc2FmZVZhbHVlKSkgOlxyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHVuc2FmZVZhbHVlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0ICYmICh0aGlzLmh0bWxJbnB1dC5yZW1vdmUoKSB8fCB0aGlzLmh0bWxJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLm9ic2VydmFibGVBcmVhcy5maW5kKGZ1bmN0aW9uKHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICByZXR1cm4geCA8IHRoaXMueCAmJiB5IDwgdGhpcy55ICYmICh4ICsgd2lkdGgpID4gdGhpcy54ICYmICh5ICsgaGVpZ2h0KSA+IHRoaXMueTtcclxuICAgICAgICB9LCB7eCwgeX0pO1xyXG4gICAgICAgIGlmICghYXJlYSkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXRjaCAoYXJlYS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdzaG93Q2FsZW5kYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXIoe3gsIHl9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93Q2FsZW5kYXIoe3gsIHl9KSB7XHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZS5zaG93KHtpbml0aWF0b3I6IHRoaXMsIHgsIHl9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb2N1cygpIHtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB7XHJcbiAgICAgICAgICAgIHRvcDogQXBwLmluc3RhbmNlLmNhbnZhcy5vZmZzZXRUb3AsXHJcbiAgICAgICAgICAgIGxlZnQ6IEFwcC5pbnN0YW5jZS5jYW52YXMub2Zmc2V0TGVmdFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgT2JqZWN0LmVudHJpZXMoe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgdG9wOiBgJHt0aGlzLnkgKyBvZmZzZXQudG9wfXB4YCxcclxuICAgICAgICAgICAgbGVmdDogYCR7dGhpcy54ICsgb2Zmc2V0LmxlZnR9cHhgLFxyXG4gICAgICAgICAgICB3aWR0aDogYCR7dGhpcy5pc0NhbGVuZGFyID8gdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0IDogdGhpcy53aWR0aH1weGAsXHJcbiAgICAgICAgICAgIGZvbnQ6ICcxNHB4IHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZGRkZGRkJyxcclxuICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgIHBhZGRpbmc6ICcycHggMCdcclxuICAgICAgICB9KS5tYXAoZSA9PiBlLmpvaW4oJzonKSkuam9pbignOycpKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5pZCA9ICdodG1sLWlucHV0LWVsZW1lbnQnO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LnZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaHRtbElucHV0KTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlKGRhdGUgPSB0aGlzLmRhdGUpIHtcclxuICAgICAgICBpZiAoIWRhdGUpIHJldHVybjtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlRm9ybWF0KGRhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUodmFsdWUgPSB0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEVkaXRCb3gucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBrZXksIG9mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25CbHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRocm90dGxlKEVkaXRCb3guZGVmaW5lQ3Vyc29yVHlwZS5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgSG92ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SG92ZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IEhvdmVyKHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyA0LCBoZWlnaHQgKyA0KTtcclxuICAgICAgICBpZiAoIWFjdGl2ZSkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmQyOTI5JztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbnRleHRNZW51KCkge31cclxuXHJcbiAgICBvbkJsdXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4IC0gMSxcclxuICAgICAgICAgICAgeTogeSAtIDEsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCArIDIsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgMixcclxuICAgICAgICAgICAgekluZGV4OiB6SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEhvdmVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7VG9vbHRpcH0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgVG9vbHRpcCh7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRleHR9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCA1MDAsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZWE5Zic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzIzMjMyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHggKyAxMCwgeSArIGhlaWdodCAtIDEwKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUoKSB7fVxyXG5cclxuICAgIG9uQmx1cigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge31cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIHNob3coe3gsIHksIHRvb2x0aXBDb250ZW50fSkge1xyXG4gICAgICAgIGNvbnN0IHtjdHgsIGNhbnZhczoge3dpZHRoOiBjYW52YXNXaWR0aH19ID0gQXBwLmluc3RhbmNlO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IHthY3R1YWxCb3VuZGluZ0JveEFzY2VudDogY29udGVudEhlaWdodCwgd2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IHggPiAoY2FudmFzV2lkdGggLSBjb250ZW50V2lkdGggLSAyMCkgPyB4IC0gY29udGVudFdpZHRoIC0gMjAgOiB4LFxyXG4gICAgICAgICAgICB5OiB5ID4gY29udGVudEhlaWdodCArIDIwID8geSAtIGNvbnRlbnRIZWlnaHQgLSAyMCA6IHksXHJcbiAgICAgICAgICAgIHdpZHRoOiBjb250ZW50V2lkdGggKyAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50SGVpZ2h0ICsgMjAsXHJcbiAgICAgICAgICAgIHRleHQ6IHRvb2x0aXBDb250ZW50LFxyXG4gICAgICAgICAgICB6SW5kZXg6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB5OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7dGV4dCwgekluZGV4fSA9IHRoaXM7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7dGV4dDogJycsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgey4uLnt4LCB5OiB5IC0gdGhpcy5oZWlnaHQsIHRleHQsIHpJbmRleH19KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBUb29sdGlwLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UodGhpcy50cmFuc2xhdGUuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7c2ludXNvaWRHZW59IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZW5kZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnVHJlbmRlcic7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMS4xO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBPdXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMC45O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBSZXNldCcsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0ubWFwKCh7Y2FsbGJhY2ssIC4uLnJlc3R9KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5yZXN0LFxyXG4gICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcihjb25maWcsIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0TWFyZ2luID0gMjA7XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGRhdGE6IHtwb2ludHN9fSA9IGNvbmZpZztcclxuICAgICAgICBjb25zdCBjaGFydEFyZWEgPSB7XHJcbiAgICAgICAgICAgIHg6IHggKyBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICB5OiB5ICsgcGFkZGluZ1swXSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gcGFkZGluZ1sxXSAtIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gcGFkZGluZ1swXSAtIHBhZGRpbmdbMl1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHttaW4sIG1heH0gPSBUcmVuZGVyLm5vcm1hbGl6ZVJhbmdlKHBvaW50cyk7XHJcbiAgICAgICAgY29uc3QgcmFuZ2VTY2FsZSA9IChjaGFydEFyZWEuaGVpZ2h0IC0gY2hhcnRNYXJnaW4pIC8gKG1heCAtIG1pbik7XHJcbiAgICAgICAgY29uc3QgemVyb0xldmVsID0gTWF0aC5mbG9vcigoY2hhcnRBcmVhLnkgKyBjaGFydE1hcmdpbiAvIDIpICsgbWF4ICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDEyNywgMTI3LCAxMjcsIDAuMiknO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoY2hhcnRBcmVhKSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdYQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWF9LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3TGVnZW5kKHsuLi5jb25maWcsIC4uLntcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeTogeSArIGhlaWdodCAtIDQwLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH19LCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0RhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIHNjYWxlLCBkYXRhOiB7cG9pbnRzID0gW119LCB6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMDBmZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHplcm9MZXZlbCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCAoLXBvaW50c1swXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzY2FsZWRWYWx1ZSA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgeFBvcyArPSBzdGVwLCBzY2FsZWRWYWx1ZSA9ICgtcG9pbnRzWysraV0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhQb3MsIHNjYWxlZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHhQb3MgLSA0LCBzY2FsZWRWYWx1ZSAtIDQsIDgsIDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdYQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeFBvcyA9IHgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSB3aWR0aCAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBjdHgubWVhc3VyZVRleHQocG9pbnRzWzBdLnRpbWUpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsT2Zmc2V0ID0gTWF0aC5yb3VuZChsYWJlbFdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzSW50ZXJ2YWwgPSBNYXRoLmNlaWwoKGxhYmVsV2lkdGggKyAyMCkgLyBpbnRlcnZhbCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dExhYmVsUG9zID0geFBvcyArIGxhYmVsc0ludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zICs9IGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gIShpICUgbGFiZWxzSW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjM2MzYzNjJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgaXNNYWpvclRpY2sgPyB5ICsgaGVpZ2h0ICsgNSA6IHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0udGltZSwgcm91bmRlZFhQb3MgLSBsYWJlbE9mZnNldCwgeSArIGhlaWdodCArIDIwKTtcclxuICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyArPSBsYWJlbHNJbnRlcnZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gMjAsIG1ham9yVGlja3NJbnRlcnZhbCwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFhMWExYSc7XHJcbiAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gaGVpZ2h0IC8gdGlja3M7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHggLTEwMCwgeSwgd2lkdGggKyAxMDAsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICB5UG9zID0gemVyb0xldmVsICsgTWF0aC5jZWlsKCh5ICsgaGVpZ2h0IC0gemVyb0xldmVsKSAvIGludGVydmFsKSAqIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKSxcclxuICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gTWF0aC5hYnMoeVBvcyAtIHplcm9MZXZlbCkgJSAoaW50ZXJ2YWwgKiBtYWpvclRpY2tzSW50ZXJ2YWwpIDwgaW50ZXJ2YWwgLyAyKSB7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGlzTWFqb3JUaWNrID8gJyM0MzQzNDMnIDogJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpc01ham9yVGljayA/IHggLSA1IDogeCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNNYWpvclRpY2spIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobGFiZWwsIHggLSBjdHgubWVhc3VyZVRleHQobGFiZWwpLndpZHRoIC0gMTAsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdMZWdlbmQoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtuYW1lfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwwLDI1NSknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobmFtZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oLTEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCA0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbygyMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCg2LCAwLCA4LCA4KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCArIHdpZHRoIC8gMiArIDUsIHkgKyBoZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMTUxNTE1JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG5hbWUsIDAsIGZvbnRIZWlnaHQgLSAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKSAtIDEwMDAgKiAyOTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKVxyXG4gICAgICAgICAgICAuZmlsbChzdGFydFRpbWUpXHJcbiAgICAgICAgICAgIC5tYXAoKHRpbWUsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKHRpbWUgKyAxMDAwICogaWR4KS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2ludXNvaWRHZW4ubmV4dCgpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja05leHREYXRhKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3RyZW5kZXJOZXh0VGljaycsIHtkZXRhaWw6IHtcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICB9fSkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigndHJlbmRlck5leHRUaWNrJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFRyZW5kZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtkZXRhaWx9KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMucHVzaChkZXRhaWwpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdWYWx1ZUl0ZW0nO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92ZScsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIb3Jpem9udGFsbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVydGljYWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eTogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEb3duJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVzaXplJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eTogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hpZGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5oaWRlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBWYWx1ZUl0ZW0uZ2VvbWV0cmljKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByYW5kb21WYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxMDApLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZpc2libGUsIHZhbHVlLCB0cmVuZCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gMDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF2aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNlcmlmJztcclxuXHRcdFx0Y29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcblx0XHRcdGlmIChhY3RpdmUpIHtcclxuXHRcdFx0XHRjdHguc2F2ZSgpO1xyXG5cdFx0XHRcdHN0YWNrKys7XHJcblx0XHRcdFx0aWYgKHRyZW5kID4gMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMDBGRjAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0cmVuZCA8IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnI2U1MDAwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRjdHguY2xpcCgpO1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG5cdFx0XHRzdGFjayAmJiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJhbmRvbUNoYW5nZSgpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMDAgKyBNYXRoLnJhbmRvbSgpICogNjAwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gdmFsdWUgPiB0aGlzLnZhbHVlID8gMSA6ICh2YWx1ZSA8IHRoaXMudmFsdWUgPyAtMSA6IDApO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25WYWx1ZUNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQoVmFsdWVJdGVtLnJhbmRvbVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVmFsdWVJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtDb2xsZWN0aW9uSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW1cIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi9jb21wb25lbnRzL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvdmFsdWUtaXRlbVwiO1xyXG5pbXBvcnQge0NoYXJ0SXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jaGFydC1pdGVtXCI7XHJcbmltcG9ydCB7RWRpdEJveH0gZnJvbSBcIi4vY29tcG9uZW50cy9lZGl0LWJveFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwiLi9jb21wb25lbnRzL2J1dHRvblwiO1xyXG5pbXBvcnQge0NvbWJvQm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbWJvLWJveFwiO1xyXG5pbXBvcnQge1RyZW5kZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJlbmRlclwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9jb21wb25lbnRzL2hvdmVyXCI7XHJcbmltcG9ydCB7Q2xvY2t9IGZyb20gXCIuL2NvbXBvbmVudHMvY2xvY2tcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyXCI7XHJcblxyXG5jb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgIHR5cGU6ICdjb2x1bW4nLFxyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiA1LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHBvaW50czogQ2hhcnRJdGVtLm1vY2tEYXRhKCksXHJcbiAgICAgICAgbWFyZ2luOiAwLjFcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRyZW5kZXJDb25maWcgPSB7XHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDIwLFxyXG4gICAgbWFqb3JUaWNrc0ludGVydmFsOiA0LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIG5hbWU6ICdzaW4oeCknLFxyXG4gICAgICAgIHBvaW50czogVHJlbmRlci5tb2NrRGF0YSgpXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBtZW51SXRlbXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdPbmUnLFxyXG4gICAgICAgIHZhbHVlOiAxLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1R3bycsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVGhyZWUnLFxyXG4gICAgICAgIHZhbHVlOiAzLFxyXG4gICAgfVxyXG5dO1xyXG5cclxuY29uc3QgYnV0dG9uQ2FsbGJhY2sgPSAoKSA9PiAoXHJcbiAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCdyYW5kb21pemVDaGFydERhdGEnKSlcclxuKTtcclxuXHJcbnNldEludGVydmFsKFRyZW5kZXIubW9ja05leHREYXRhLCAxMDAwKTtcclxuXHJcbkFwcC5pbnN0YW5jZS5jb21wb25lbnRzID0gW1xyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBDbG9jayh7eTogMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pXHJcbiAgICBdLFxyXG4gICAgLi4uQ29sbGVjdGlvbkl0ZW0uY29tcG9zZSh7eDogMCwgeTogMzAsIGNvbHM6IDI1LCByb3dzOiAxMiwgZ2FwOiAyMCwgY3RvcjogVmFsdWVJdGVtfSksXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDAsIHk6IDYwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAxMDAsIHk6IDYwMCwgd2lkdGg6IDEwMCwgekluZGV4OiAxLCBpc0NhbGVuZGFyOiB0cnVlLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDb21ib0JveCh7eDogMjUwLCB5OiA2MDAsIHpJbmRleDogMSwgdmFyaWFibGVOYW1lOiAnQ29tYm9ib3gxJywgbWVudUl0ZW1zLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDaGFydEl0ZW0oey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiAzMCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi5jaGFydENvbmZpZ30pLFxyXG4gICAgICAgIG5ldyBCdXR0b24oe3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSBCdXR0b24uZ2VvbWV0cmljLndpZHRoLCB5OiA0NTAsIHpJbmRleDogMSwgdmFsdWU6ICdSYW5kb21pemUnLCBjYWxsYmFjazogYnV0dG9uQ2FsbGJhY2ssIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IFRyZW5kZXIoey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiA0OTAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4udHJlbmRlckNvbmZpZ30pLFxyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UsXHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UsXHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2UsXHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZVxyXG4gICAgXVxyXG5dO1xyXG5cclxuQXBwLmluc3RhbmNlLnJlbmRlcigpO1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHRocmVzaG9sZCwgYXJnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGltZW91dCA9IHRydWUsIHRocmVzaG9sZCk7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICB0aW1lb3V0ICYmIGZuKGFyZyk7XHJcbiAgICAgICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3Qgc2ludXNvaWRHZW4gPSAoZnVuY3Rpb24qICgpIHtcclxuICAgIGNvbnN0IHBlcmlvZCA9IE1hdGguUEkgKiAyO1xyXG4gICAgY29uc3QgcSA9IDAuNTtcclxuICAgIGxldCBfaSA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgTWF0aC5yb3VuZChNYXRoLnNpbihfaSsrICogcSAlIHBlcmlvZCkgKiAxMDAwMCkgLyAxMDA7XHJcbn0pKCk7XHJcblxyXG5jb25zdCB0aW1lRm9ybWF0ID0gKHRpbWVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRpbWUgPT4gdGltZUZvcm1hdHRlci5mb3JtYXQodGltZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLCBzZWNvbmQ6ICcyLWRpZ2l0J30pKTtcclxuXHJcbmNvbnN0IGRhdGVGb3JtYXQgPSAoZGF0ZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PiBkYXRlRm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuJywge2RheTogJzItZGlnaXQnLCBtb250aDogJzItZGlnaXQnLCB5ZWFyOiAnbnVtZXJpYyd9KSk7XHJcblxyXG5leHBvcnQgeyBzaW51c29pZEdlbiwgdGltZUZvcm1hdCwgZGF0ZUZvcm1hdCB9XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9