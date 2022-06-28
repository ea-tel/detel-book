//const {
//  computeContrastRatio,
//  computeLuminance,
//  convertRGBAtoRGB,
//  parseRGB,
//  convertRGBArrayToString,
//  rectWidth,
//  rectHeight,
//  detectTouchscreen,
//} = require('./utils');
let d3 = null;
const ELLIPSIS_CODE = 8230;
const U_ELLIPSIS = "&#" + ELLIPSIS_CODE.toString() + ";";
const HIGHLIGHT_DURATION_SEC = 60;
let widgetTitle = '';
let data = null;
let treemapId = null;
let treemapAccessibilityText = null;
let taxonomy = null;
let updateProgressCallback = null;
let highlightedGoals = null;
let confirmationBoxesActive = null;
const colorschemeStorageName = 'treemapColorscheme';

/**
* Creates the treemap svg node and appends it to the #treemapId element.
*/
async function getSvgNode() {
  let rootElement = document.getElementById(treemapId);
  let clientWidth = rootElement.clientWidth;
  //let width = clientWidth < 1200 ? clientWidth : (clientWidth) / 2;
  let width = clientWidth;
  if (width === 0) {
  return;
  }
  //    if (width > 1200)
  //      width = 1200;
  const stdHeight = window.innerHeight * 0.9;
  let height = stdHeight;
  let isLandscapeMode = width > height;
  let isSmallScreen = clientWidth < 1100;
  let fontFactor = 0.57;
  let circlesViewBox = 32;
  let learningGoalMinHeight = 45;
  let hasTouchscreen = detectTouchscreen();

  let colorSchemesNames = ['custom', 'Warm', 'Cool', 'Reds', 'Greens',
    'Blues', 'RdBu', 'protanopia', 'grayscaleLight',
  'PuOr', 'deuteranopia', 'grayscaleDark', 'grayscaleMiddle'];
  let additionalColors = {
    'custom': ['#c78dff','#c78dff', '#60e480', '#60e480','#fd9a51', '#fd9a51',
      '#5fadff', '#5fadff', '#5fadff', '#5fadff'],
    'protanopia': ['#D1D0DE', '#BDB6AB', '#636D97'],
  'deuteranopia': ['#C59434', '#6F7498', '#092C48'],
  'grayscaleLight': ['#ddd', '#eaeaea'],
  'grayscaleDark': ['#050505', '#030303'],
  'grayscaleMiddle': ['#ddd', '#030303'],
  };
  let colorblindSchemes = ['PuOr', 'deuteranopia', 'grayscaleDark', 'grayscaleMiddle'];
  let color = d3.scaleOrdinal(d3.quantize(getColorScheme(), data.children.length + 2));
  // Zoom variables
  let isZoomedIn = false;
  let zooming = false;
  let transitionDuration = 750;
  // Variable for button with link on top left
  let linkEnlarged = false;
  let resizingLink = false;
  let sliderTextMaxFontSize = 13;
  let currentTextZoom = isSmallScreen ? 0 : -2;
  let zoomDelta = isSmallScreen ? 0.5 : 2;
  let isZoomInDisabled = false;
  let hideTextDuration = 100;
  let allElementSmallEnough = true;

  let { numberOfTopics, highestNumberChildren } = getNumberOfElements(data);
  let partition = data => {
    const root = d3.hierarchy(data)
  .each(d => {
    if (d.children && !d.children[0].children) {
  d.children.forEach((child) => {
    child.siblingsCount = d.children.length;
  });
  //            if (d.children.length + 1 > highestNumberChildren && 'children' in d)
  //              highestNumberChildren = d.children.length + 1;
  }
  })
  .sum(d => d.children ? (highestNumberChildren - d.children.length) : 1); //all blocks same size
  root.value = highestNumberChildren * root.children.length; // all blocks same size
  return d3.partition()
  .size([height, (root.height + 1) * width / 3])
  .padding(0.7)(root);
  };
  height = numberOfTopics * (highestNumberChildren - 1) * learningGoalMinHeight;
  if (height < stdHeight) {
  height = stdHeight;
  }
  const root = partition(taxonomy);
  widgetTitle = root.data.name;
  const rejectPath = 'M6,6 L26,26 M6,26 L26,6';
  const acceptPath = 'M2,18 L11,27 L30,5';

  const svg = d3.create("svg:svg")
  .attr('aria-labelledby', 'vis-title')
  //      .attr('height', height)
  //      .attr('width', width)
  .attr("class", "mainSvg")
  .style('z-index', 0)
  .attr("viewBox", [0, 0, width, height]);
  d3.select('#' + treemapId).append(() => svg.node());
  svg.append('title')
  .attr('class', 'vis-title');
  var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
  .attr("id", "gradient-" + treemapId)
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%");

  // Gradient colors
  gradient.append("svg:stop")
  .attr("offset", "0%")
  .attr("stop-color", "#eee");

  gradient.append("svg:stop")
  .attr("offset", "100%")
  .attr("stop-color", "#ddd");

  let tempEl = svg.append('text').text('100%');

  let tempElLen = d3.select(d3.select(tempEl).node()._groups[0]).node()[0].getComputedTextLength();
  let mainCircleRadius = Math.min(Math.max(rectHeight(root.children[0]) / 6, tempElLen * 2 / 3),
    Math.min(30, rectHeight(root.children[0]) / 2.5));
  tempEl.remove();
  let topicCellPadding = .5 * mainCircleRadius;
  let mainCircleWidth = 2 * mainCircleRadius;
  let subCircleRadius = mainCircleRadius * .8;
  let subCircleWidth = 2 * subCircleRadius;
  let dropShadowParams = '1px 1px 1px';

  // Resizing columns, first thin, second standard, third larger
  let rootWidthReduction = 7;
  root.y1 /= rootWidthReduction;
  if (root.y1 - root.y0 > 50) {
  root.y1 = root.y0 + 50;
  }
  let lastY = 0;
  let learningGoalPadding = 0.5;
  root.each(d => {
    if (d.depth === 0) {
  d.x1 += .1;
  return;
  }
  if (d.depth === 1) {
  let tempY0 = d.y0;
  d.y0 = root.y1 + 0.7;
  d.y1 -= tempY0 - d.y0;
  if (d.y1 - d.y0 > 300) {
  d.y1 = d.y0 + 300;
  }
  d.tabindex = (5 * d.value + 1) * d.parent.children.indexOf(d) + 2;
  }
  else {
  d.y0 = d.parent.y1 + 0.7;
  d.y1 -= 300;
  const currentWidth = rectWidth(d);
  if (currentWidth <= 0) {
  d.y1 = d.y0 + 1;
  }
  //Equal sized rect in middle of screen
  //        let newX = (highestNumberChildren - d.siblingsCount) * (d.x1 - d.x0) / 2.0;
  //        d.x0 += newX;
  //        d.x1 += newX;
  //Expand learning goal to max
  const blockSize = (d.parent.x1 - d.parent.x0 - learningGoalPadding * (d.siblingsCount - 1)) / d.siblingsCount;

  let idx = d.parent.children.indexOf(d);
  d.x0 = d.parent.x0 + idx * blockSize + learningGoalPadding * idx;
  d.x1 = d.x0 + blockSize;
  d.proY0 = d.y1 - d.y0;
  d.proY1 = d.proY0 + (d.parent.x1 - d.parent.x0 - learningGoalPadding * (d.siblingsCount - 1)) / highestNumberChildren;
  d.proX0 = (d.x1 - d.x0 - (d.proY1 - d.proY0)) / 2;
  d.proX1 = d.proX0 + (d.proY1 - d.proY0);
  lastY = d.y1 + d.proY1 - d.proY0;
  }
  });
  let depth1Child = root.children[0];
  let depth2Child = findDepth2Child(root);
  // If mobile change layout
  if (isSmallScreen && depth2Child) {
  root.each(d => {
    if (d.depth == 1) {
  d.y1 = depth2Child.y1;
  }
  });
  }
  let depth1Width = rectWidth(depth1Child);
  let depth2Width = rectWidth(depth2Child) ?? 1;
  let linkContainerSize = Math.min(Math.min(3 * mainCircleRadius / 2, 30), rectHeight(depth1Child) / 3);
  let linkIconSize = linkContainerSize * 0.75;
  if (isSmallScreen && isLandscapeMode) {
  linkContainerSize *= 2;
  linkIconSize *= 2;
  }
  let changingProgress = false;
  let lastMousePosition = null;
  let objectToMove = null;
  let currentProgress = null;
  let circleEnlargeFactor = depth2Child ? Math.min(4, 86 / sliderSize(depth2Child)) : 0;
  if (isLandscapeMode && isSmallScreen && hasTouchscreen) {
  circleEnlargeFactor = 1.5 * circleEnlargeFactor;
  }
  let sliderCircleIconSize = depth2Child ? Math.min(sliderSize(depth2Child), 20.13) : 0;
  let sliderCircleRadius = depth2Child ? Math.min(sliderSize(depth2Child) / 1.5, 16) : 0;
  lastY = depth2Child ? depth2Child.y1 + sliderSize(depth2Child) : depth1Child.y1;
  let colorPaletteSize = 25;
  if (isSmallScreen && !isLandscapeMode) {
  colorPaletteSize = (width - lastY) / 8;
  }
  else if (isSmallScreen) {
    colorPaletteSize = (width - lastY) / 14;
  //      sliderCircleIconSize *= 2;
  //      sliderCircleRadius *= 2;
  }
  if (colorPaletteSize < 0) {
  colorPaletteSize = 0;
  }
  let colorPaletteBgRadius = colorPaletteSize;
  let yShift = colorPaletteSize / 2 + 3;
  let colorSchemeHolderPadding = 25;
  if (isSmallScreen) {
  colorSchemeHolderPadding = 10;
  }
  let cornerRadius = colorSchemeHolderPadding / 3;
  let colorBoxWidth = Math.min(((width - lastY) * 0.7 - 2 * cornerRadius) / (data.children.length + 1),
    colorPaletteBgRadius * Math.sqrt(2) - 2 * cornerRadius);
  if (isSmallScreen) {
  colorBoxWidth = 7;
  }
  let colorBoxHeight = colorBoxWidth;
  let colorSchemeHolderHeight = colorBoxWidth + 2 * cornerRadius;
  let colorSchemeHolderWidth = colorBoxWidth * (data.children.length + 1) + 2 * cornerRadius;
  let useDoubleColumnColorScheme = yShift + 2 * colorPaletteBgRadius +
    (colorSchemeHolderHeight + 10) * (colorSchemesNames.length - 1) +
  colorSchemeHolderHeight + 5 * colorPaletteSize > height;
  let colorSchemeTouchRects = true;
  let colorBoxFactor = 0.7;
  while (useDoubleColumnColorScheme && colorSchemeTouchRects && colorBoxFactor >= 0.1) {
  yShift = colorPaletteSize / 2 + 3;
  colorSchemeHolderPadding = 13;
  cornerRadius = colorSchemeHolderPadding / 3;
  colorBoxWidth = Math.max(Math.min(((width - lastY) * colorBoxFactor - 2 * cornerRadius) / (data.children.length + 1),
    colorPaletteBgRadius * Math.sqrt(2) - 2 * cornerRadius), 1);
  colorBoxHeight = colorBoxWidth;
  colorSchemeHolderHeight = colorBoxWidth + 2 * cornerRadius;
  colorSchemeHolderWidth = colorBoxWidth * (data.children.length + 1) + 2 * cornerRadius;
  useDoubleColumnColorScheme = yShift + 2 * colorPaletteBgRadius +
    (colorSchemeHolderHeight + 10) * (colorSchemesNames.length - 1) +
  colorSchemeHolderHeight + 5 * colorPaletteSize > height;
  colorSchemeTouchRects = lastY > (width - lastY) / 4 + lastY - colorSchemeHolderWidth / 2;
  colorBoxFactor -= 0.1;
  }

  let colorData = [];
  colorSchemesNames.forEach((color, index) => colorData.push({
    index: index,
  colorscheme: color,
  colorblind: colorblindSchemes.includes(color)
  }));

  let toolBar = svg.append('g');

  let colorSchemePickerG = toolBar.append('g')
  .attr('transform', `translate(${0},${5 * colorPaletteSize})`)
  .attr('class', 'colorSchemePicker')
  .attr('aria-hidden', true);
  let colorSchemesContainer = colorSchemePickerG.append('g')
  .attr('class', 'colorSchemesContainer');
  let colorSchemeSample = colorSchemesContainer
  .selectAll(null)
  .data(colorData)
  .join('svg')
  .attr('x', (width - lastY - colorSchemeHolderWidth) / 2 + lastY)
  .attr('y', yShift + colorPaletteSize / 2 - colorSchemeHolderHeight / 2)
  .attr('width', colorSchemeHolderWidth)
  .attr('height', colorSchemeHolderHeight)
  .attr('viewBox', `0 0 ${colorSchemeHolderWidth} ${colorSchemeHolderHeight} `)
  .attr('fill', d => d.colorblind ? '#383866' : `url(#gradient-${treemapId})`)
  .attr('cursor', 'pointer')
  .attr('filter', `drop-shadow(${dropShadowParams} rgba(0,0,0,0.5))`)
  .on('click', (_, d) => changeColorScheme(d.colorscheme));

  let colorSchemeSamplePath = colorSchemeSample.append('path')
  .attr('d', roundedCornersRect(
    colorSchemeHolderWidth,
  colorSchemeHolderHeight,
  colorBoxWidth + 2 * cornerRadius,
  colorSchemeHolderHeight,
  cornerRadius
  ));
  let colorSchemeBox = colorSchemeSample
  .selectAll(null)
  .data(d => ramp(d.colorscheme, d.index))
  .join('rect')
  .attr('y', (colorSchemeHolderHeight - colorBoxHeight) / 2)
  .attr('x', (colorSchemeHolderWidth - colorBoxWidth) / 2)
  .attr('height', colorBoxHeight)
  .attr('width', colorBoxWidth)
  .attr('fill', d => d.color);


  let colorPaletteIconG = colorSchemePickerG.append('g')
  .attr('class', 'colorPaletteIconG');
  let colorPaletteBg = colorPaletteIconG.append('circle')
  .attr('filter', `drop-shadow(${dropShadowParams} rgba(0,0,0,0.5))`)
  .attr('cx', (width - lastY) / 2 + lastY)
  .attr('cy', yShift + colorPaletteSize / 2)
  .attr('r', colorPaletteBgRadius)
  .attr('cursor', 'pointer')
  .attr('fill', `url(#gradient-${treemapId})`)
  .on('click', toggleColorSchemes);
  let colorPaletteSvg = colorPaletteIconG.append('svg')
  .attr('x', (width - lastY - colorPaletteSize) / 2 + lastY)
  .attr('y', yShift)
  .attr('width', colorPaletteSize)
  .attr('height', colorPaletteSize)
  .attr('viewBox', '0 0 512 512')
  .attr('cursor', 'pointer')
  .attr('fill', 'rgb(40, 40, 40)')
  .on('click', toggleColorSchemes);
  colorPaletteSvg.append('path')
  .attr('d', 'M491.514,148.498c27.293-27.293,27.293-71.701,0-98.994L442.017,0.007l-43.382,43.382' +
    ' C356.067,14.713,306.619-0.279,254.762,0.004C114.059,0.68-0.22,115.717,0.017,256.44' +
  'c0.115,68.288,26.794,132.471,75.125,180.724 c48.335,48.26,112.571,74.837,180.875,74.837' +
  'c13.478,0,27.011-1.059,40.224-3.146c20.168-3.188,37.24-15.365,46.838-33.411 ' +
  'c9.753-18.337,10.29-39.698,1.471-58.605c-9.644-20.677-14.533-42.827-14.533-65.837' +
  'c0-29.521,8.28-58.253,23.945-83.089 c11.303-17.92,26.072-33.28,43.344-45.235l8.777,254.863l0.008,0.19' +
  'c0.906,19.217,16.687,34.27,35.926,34.27 c19.239,0,35.02-15.054,35.926-34.27l8.904-258.531' +
  'c3.239-4.215,5.17-9.484,5.17-15.199v-40c0-4.636-1.273-8.979-3.482-12.705 ' +
  'C489.549,150.392,490.547,149.466,491.514,148.498z M392.017,164.001v26.484' +
  'c-25.685,15.062-47.458,36.102-63.429,61.423 c-18.691,29.634-28.571,63.899-28.571,99.093' +
  'c0,27.424,5.835,53.841,17.345,78.517c4.8,10.291,4.519,21.896-0.769,31.839 ' +
  'c-5.133,9.65-14.258,16.162-25.035,17.865c-11.669,1.845-23.627,2.779-35.541,2.779' +
  'c-60.299,0-117.007-23.463-159.679-66.066 c-42.666-42.599-66.219-99.26-66.321-159.545' +
  'C29.808,132.156,130.693,30.601,254.906,30.004 c44.89-0.212,87.796,12.497,124.892,36.882' +
  'c-5.077,9.81-7.781,20.752-7.781,32.115c0,18.698,7.282,36.276,20.503,49.497 ' +
  'c0.968,0.968,1.966,1.894,2.979,2.798C393.29,155.022,392.017,159.365,392.017,164.001z M447.972,476.381 ' +
  'c-0.182,3.156-2.786,5.62-5.956,5.62s-5.773-2.464-5.956-5.62l-8.519-247.38h28.949L447.972,476.381z ' +
  'M462.017,199.001h-40v-30h40 V199.001z M470.3,127.285c-7.555,7.556-17.6,11.716-28.284,11.716' +
  'c-10.684,0-20.729-4.16-28.284-11.716h-0.001 c-15.596-15.596-15.596-40.973,0-56.568l28.285-28.284l28.285,28.284' +
  'c7.555,7.555,11.715,17.6,11.715,28.284    C482.016,109.685,477.856,119.73,470.3,127.285z');
  let radius = 45;
  let innerRadiusFactor = 2;
  appendEmptyCirclePath(colorPaletteSvg, 238, 74, radius, innerRadiusFactor);
  appendEmptyCirclePath(colorPaletteSvg, 124, 263, radius, innerRadiusFactor);
  appendEmptyCirclePath(colorPaletteSvg, 145, 143, radius, innerRadiusFactor);
  appendEmptyCirclePath(colorPaletteSvg, 211, 346, radius, innerRadiusFactor);

  let zoomIconG = toolBar.append('g')
  .attr('class', 'zoomIconG')
  .attr('transform', `translate(${(width - lastY) / 2 + lastY - colorPaletteSize},${2.5 * colorPaletteSize})`)
  .on('click', null);

  zoomIconG.append('circle')
  .attr('filter', `drop-shadow(${dropShadowParams} rgba(0,0,0,0.5))`)
  .attr('cx', colorPaletteSize)
  .attr('cy', colorPaletteSize)
  .attr('r', colorPaletteBgRadius)
  .attr('fill', `url(#gradient-${treemapId})`);

  let zoomBG = zoomIconG.append('svg')
  .attr('viewBox', '0 0 100 100')
  .attr('height', 2 * colorPaletteSize)
  .attr('width', 2 * colorPaletteSize)
  .attr('x', 0)
  .attr('y', 0)
  .attr('class', 'zoomHalvesContainer');


  let zoomInIconWidth = 20;
  let zoomLeftHalfSvg = zoomBG.append('svg')
  .attr('class', 'zoomLeftHalf')
  .attr('cursor', 'pointer')
  .on('click', zoomOutText);
  let zoomLeftHalf = zoomLeftHalfSvg.append('path')
  .attr('d', `M 50,1 a 49 49 0 0 0 0,98 a 99999 9999  0 0 0 0,-98  z`)
  .attr('fill', `url(#gradient-${treemapId})`);

  // zoomLeftHalfIcon
  zoomLeftHalfSvg.append('path')
  .attr('d', `M ${(50 - zoomInIconWidth) / 2 + 2},50  h ${zoomInIconWidth}`)
  .attr('stroke', 'black')
  .attr('stroke-width', 3)
  .attr('stroke-linecap', 'round')
  .attr('stroke-opacity', 1);

  let zoomRightHalfSvg = zoomBG.append('svg')
  .attr('cursor', 'pointer')
  .attr('class', 'zoomRightHalf')
  .on('click', zoomInText);
  let zoomRightHalf = zoomRightHalfSvg.append('path')
  .attr('d', `M 50,1 a 49 49 0 0 1 0,98 a 99999 9999  0 0 1 0,-98  z`)
  .attr('fill', `url(#gradient-${treemapId})`);
  //zoomRightHalfIcon
  zoomRightHalfSvg.append('path')
  .attr('d', `M ${48 + (50 - zoomInIconWidth) / 2}, 50 h ${zoomInIconWidth}` +
    ` M ${50 / 2 + 48},${50 - zoomInIconWidth / 2}  v ${zoomInIconWidth} `)
  .attr('stroke', 'black')
  .attr('stroke-width', 3)
  .attr('stroke-linecap', 'round')
  .attr('stroke-opacity', 1);

  // zoom separation line
  zoomBG.append('path')
  .attr('d', 'M 50,1 v 98')
  .attr('stroke', 'black')
  .attr('stroke-opacity', .5);

  let accessibilityIconG = toolBar.append('g')
  .attr('class', 'accessibilityIcon')
  .on('click', toggleAccessibilityDialog);
  let accessibilityDialogPathRadius = 10;
  let accessibilityWidth = width - lastY - 10;

  let accessibilityBG = accessibilityIconG.append('circle')
  .attr('filter', `drop-shadow(${dropShadowParams} rgba(0,0,0,0.5))`)
  .attr('cx', (width - lastY) / 2 + lastY)
  .attr('cy', yShift + colorPaletteSize / 2)
  .attr('r', colorPaletteBgRadius)
  .attr('cursor', 'pointer')
  .attr('fill', `url(#gradient-${treemapId})`);
  let accessibilityIcon = accessibilityIconG.append('svg')
  .attr('x', (width - lastY - colorPaletteSize) / 2 + lastY)
  .attr('y', yShift)
  .attr('width', colorPaletteSize)
  .attr('height', colorPaletteSize)
  .attr('viewBox', '0 0 100 100')
  .attr('cursor', 'pointer')
  .attr('fill', 'none')
  .attr('stroke', 'black')
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-width', 10);
  accessibilityIcon.append('path')
  .attr('d', 'M50,35L50,40A90,90 0 0 1 35,95M50,40A90,90 1 0 0 65,95 M50,35 A 100,100 1 0 0 85,20M50,35 A 100,100 0 0 1 15,20');
  accessibilityIcon.append('circle')
  .attr('cx', 50)
  .attr('cy', 10)
  .attr('r', 5);


  // Create cell rectangles
  const cell = svg
  .append('g')
  .selectAll("g")
  .data(root.descendants())
  .join("g")
  .attr('role', 'listitem')
  .attr('aria-labelledby', (d, i) => `depth${d.depth}_idx${i}`)
  .attr("transform", d => {
    if (d.depth < 2 || !isSmallScreen) {
  return `translate(${d.y0},${d.x0})`;
  }
  else {
  return `translate(${d.parent.y1},${d.x0})`;
  }
  });
  cell.filter(d => d.depth === 0)
  .attr('id', 'root-rect' + treemapId);

  const rect = cell.append("rect")
  .attr("width", d => d.y1 - d.y0)
  .attr('display', d => d.depth < 2 || !isSmallScreen ? 'initial' : 'none')
  .attr("height", d => d.x1 - d.x0)
  .attr('class', 'rect')
  .attr("fill-opacity", 0.6)
  .attr("fill", d => {
    if (!d.depth) { return color(d.data.name); }
  while (d.depth > 1) { d = d.parent; }
  return color(d.data.name);
  });


  if (depth2Child) {
  rect.filter(d => d.depth > 0)
  .on("click", clicked);
  }
  rect.filter(d => d.depth === 0)
  .attr('tabindex', 0)
  .attr('aria-label', `Learning goal widget for ${root.data.name}.
${root.children.length} topic${root.children.lenght > 1 ? 's' : ''} present.`);
  setDepth1AriaLabel();
  rect.filter(d => d.depth === 1)
  .on('keydown', (evt, d) => {
    evt = evt || window.event;
  if (evt.ctrlKey && evt.keyCode == 13 && d.data.link) {
  window.open(d.data.link.replaceAll('\\\/', '/'), '');
  }
  else if (evt.keyCode == 13) {
    clicked(null, d);
  }
  });
  rect.filter(d => d.depth === 2)
  .attr('aria-live', "polite")
  .attr('aria-labelledby', (d, i) => `depth${d.depth}_idx${i}`);

  let learningGoalTitle = rect.filter(d => d.depth === 2)
  .append('title')
  .attr('class', (d, i) => `depth${d.depth}_idx${i}`)
  .text(d => `${d.data.name} - Progress ${parseInt(computeProgress(d) * 100)}%.
${d.data.link ? 'External link is available, press control and enter to open it.' : ''}`);
  let isEnteringValue = false;
  let newProgress = '';
  rect.filter(d => d.depth === 2)
  .on('keydown', (evt, d) => {
    evt = evt || window.event;
  if (!isEnteringValue && evt.ctrlKey && evt.shiftKey && evt.keyCode == 13) {
  isEnteringValue = true;
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(d => `The current progress for the learning goal ${d.data.name} is ${d.data.pro}%.
Please enter now the new value. You can save the changes by pressing ctrl shift enter
  or reject them by pressing ctrl shift delete.`);
  }
  else if (!isEnteringValue && evt.ctrlKey && evt.keyCode == 13 && d.data.link) {
    window.open(d.data.link.replaceAll('\\\/', '/'), '');
  }
  else if (isEnteringValue) {
    //console.log(evt.keyCode);
  if (evt.keyCode >= 48 && evt.keyCode <= 57) {
  newProgress += String.fromCharCode(evt.keyCode);
  if (parseInt(newProgress) > 100) {
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`The entered value is ${newProgress}, but it should between 0 and 100,
please change it. You can press delete to remove the last digit or ctrl shift delete to exit.`);
  }
  else {
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`New value ${newProgress}. Press ctrl shift enter to confirm.`);
  }
  }
  else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 8) {
    learningGoalTitle.filter(d2 => d2.depth === 2 && d2 === d)
  .text(`Changes aborted. Progress is set to its previous value ${d.data.pro}%.`);
  setTimeout(() => {
    learningGoalTitle.filter(d2 => d2.depth === 2 && d2 === d)
  .text(d => `Learning goal ${d.data.name}.
Progress ${parseInt(computeProgress(d) * 100)}%.
  ${d.data.link ? 'External link is available, press control and enter to open it.' : ' '}`);
  }, 5000);
  newProgress = '';
  isEnteringValue = false;
  }
  // Save with Shift+Ctrl+Enter
  else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 13) {
    let newProInt = parseInt(newProgress);
  if (newProInt < 0 || newProInt > 100) {
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`The entered value is ${newProgress}, but it should between 0 and 100,
please change it. You can press delete to remove the last digit or ctrl shift delete to exit.`);
  }
  else {
  let currentProg = Math.round(computeProgress(d.parent) * 100) / 100;
  d.data.pro = newProInt;
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`Confirmed changes. New progress ${d.data.pro}%.`);
  setTimeout(() => {
    learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(d => `Learning goal ${d.data.name}.
Progress ${parseInt(computeProgress(d) * 100)}%.
  ${d.data.link ? 'External link is available, press control and enter to open it.' : ' '}`);
  }, 5000);
  let trans = d3.transition().duration(300).ease(d3.easeExp);
  resetSlider((d2) => d2.depth === 2 && d2 === d,
  trans,
  false);
  learningGoalProgressBar.filter(d2 => d2.depth === 2 && d2 == d).transition(trans)
  .attr('width', d => computeLearningGoalProgressBarWidth(d));
  sliderSvg.filter(d2 => d2.depth === 2 && d2 == d).transition(trans)
  .attr('x', d => {
    let newVal = computeCircleContainerXPosition(d);
  return d.data.pro === 100 ? newVal + 1 : newVal;
  });
  sliderText.filter(d2 => d2.depth === 2 && d2 == d).transition(trans)
  .text(newProgress + '%')
  .attr("x", d => {
    let newVal = computeCircleTextXPosition(d);
  return d.data.pro === 100 ? newVal + 1 : newVal;
  });
  let newProg = Math.round(computeProgress(d.parent) * 100) / 100;
  let sign = currentProg > newProg ? -.01 : .01;
  changeProgressDegree(currentProg, sign, currentProg, newProg, d.parent, 300);
  newProgress = '';
  isEnteringValue = false;
  }

  }
  // Delete one digit with delete
  else if (evt.keyCode == 8) {
    newProgress = newProgress.substr(0, newProgress.length - 1);
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`New value ${newProgress}. Press ctrl shift enter to confirm or ctrl shift delete to abort.`);
  }
  // Trying to move tab
  else if (evt.keyCode == 9 || evt.Tab) {
    newProgress = newProgress.substr(0, newProgress.length - 1);
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text(`Please confirm or reject the changes before moving to another learning goal.
The entered value is ${newProgress}. Press ctrl shift enter to confirm
  or ctrl shift delete to abort.`);
  evt.preventDefault();
  }
  else if (evt.ctrlKey || evt.shiftKey || evt.keyCode == 13) { }
  // If some letters or weird keys are entered
  else {
  learningGoalTitle.filter(d2 => d2.depth === 2 && d2 == d)
  .text('You can enter only digits currently. Press control shift delete to exit.' +
    ` The number entered is ${newProgress !== '' ? newProgress : 'still empty.'}`);
  }
  }
  });

  // Create learning goal progress bar
  let learningGoalProgressBar = cell.filter(d => d.depth === 2)
  .append("rect")
  .attr("width", d => isSmallScreen ? 0 : rectWidth(d) * computeProgress(d))
  .attr("height", d => rectHeight(d))
  .attr('y', 0)
  .attr("fill-opacity", 0.6)
  .attr("fill", d => color(d.parent.data.name))
  .on("click", depth2Child ? clicked : null);
  let textCellClass = 'mainCellText';
  const text = cell.append("text")
  .style("user-select", "none")
  .attr("pointer-events", "none")
  .attr('aria-hidden', true)
  .attr('class', textCellClass)
  .attr("width", d => d.y1 - d.y0);


  text.filter(d => d.depth === 0)
  .style('font-weight', 'bold')
  .style('letter-spacing', '1em')
  .style('text-anchor', 'initial')
  .style('writing-mode', 'vertical-lr')
  .style('text-orientation', 'upright');
  text.filter(d => d.depth === 2)
  .attr('display', isSmallScreen ? 'none' : 'initial');

  const maintspan = text.append("tspan")
  .text(d => d.data.name)
  .attr('dx', 0)
  .attr('x', 4)
  .attr('y', d => d.depth === 1 ? rectHeight(d) / 2 : rectHeight(d) / 2)
  .attr('fill', d => contrastCorrectedColor(d, 0.6, d.depth === 2))
  .style('opacity', 1)
  .style('fill-opacity', 1)
  .style("font", d => `${fontSize(d)}px sans-serif`);
  maintspan.filter(d => d.depth === 1)
  .style('text-anchor', 'middle')
  .attr('x', d => (rectWidth(d) - 2.5 * mainCircleRadius) / 2);

  // Vertical text on first column
  maintspan.filter(d => d.depth === 0)
  .attr('y', d => rectHeight(d) / 2)
  .attr('x', d => rectWidth(d) / 2)
  .style('dominant-baseline', 'central')
  .style('text-anchor', 'middle')
  .style('font-weight', 'bold');
  // Add ... when text too long for cell
  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  depth1Width - mainCircleWidth - 3 * topicCellPadding,
  false,
  (el) => rectHeight(el),
  topicCellPadding);
  let rootNode = null;
  let rootText = null;
  maintspan.filter(d => d.depth === 0)
  .each((_, i, n) => {
    rootText = n[i].parentNode;
  rootNode = rootText.parentNode;
  });
  d3.select(rootText).attr('class', 'rootText');
  d3.select(rootNode).attr('class', 'rootNode');
  if (rootText.getBBox().height >= rootNode.querySelector('.rect').getBBox().height) {
  text.filter(d => d.depth === 0)
  .style('letter-spacing', '0.3em');
  if (rootText.getBBox().height >= rootNode.querySelector('.rect').getBBox().height) {
  truncateTitle(rootText, rootNode, maintspan.filter(d => d.depth === 0));
  }
  }

  // Multiline on topics
  maintspan
  .filter(d => d.depth === 2)
  .style('dominant-baseline', 'mathematical')
  .call(truncateText, depth2Width * 0.95, true);
  // create slider
  let sliderG = cell.filter(d => d.depth === 2).append('g')
  .attr('class', 'sliderG');

  let sliderRejectG = sliderG.append('g').attr('class', 'circleReject');
  let sliderRejectSvg = setupSliderSvg(sliderRejectG, 'reject', rejectChanges);
  let sliderRejectCircle = setupSliderCircles(sliderRejectSvg);
  let sliderRejectIcon = setupSliderCircleIcon(sliderRejectSvg, 'reject');

  let sliderAcceptG = sliderG.append('g').attr('class', 'circleAccept');
  let sliderAcceptSvg = setupSliderSvg(sliderAcceptG, 'accept', acceptChanges);
  let sliderAcceptCircle = setupSliderCircles(sliderAcceptSvg);
  let sliderAcceptIcon = setupSliderCircleIcon(sliderAcceptSvg, 'accept');

  let sliderSvg = sliderG
  .append('svg')
  .attr('aria-label', d => `Progress slider, current progress ${d.data.pro}%. ` +
    `Press enter and then use the arrow keys to adjust. Press enter when you are done.`)
  .attr('x', d => isSmallScreen ? 0 : d.proY0)
  .attr('y', d => (rectHeight(d) - sliderSize(d)) / 2)
  .attr('class', 'slider')
  .attr('width', d => sliderSize(d))
  .attr('height', d => sliderSize(d))
  .attr('viewBox', '0 0 100 100')
  .attr('fill', d => color(d.parent.data.name));
  if (!hasTouchscreen) {
  sliderSvg
  .on('mouseenter', (e, d) => resizeSlider(e, d))
  .on('mouseleave', (e, d) => resizeSlider(e, d))
  .on('mousedown', (e, d) => startChangingProgress(e, d));
  }
  else {
  sliderSvg
  .on('touchstart', (e, d) => sliderTouchStart(e, d))
  .on('touchmove', e => sliderTouchMove(e))
  .on('touchend', () => sliderTouchEnd());
  }
  let sliderPath = sliderSvg
  .append('path')
  .attr('d', `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 `);

  let sliderText = sliderG
  .append('text')
  .text('100%')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('x', d => isSmallScreen ? sliderSize(d) / 2 : d.proY0 + sliderSize(d) / 2)
  .attr('y', d => rectHeight(d) / 2)
  .style("user-select", "none")
  .attr("pointer-events", "none")
  .attr('fill', d => contrastCorrectedColor(d, 1, false))
  .style('font', (d) => `${sliderTextSize(d, true)}px sans-serif`);
  let showSliderPercent = checkSliderPercentFits();
  sliderText
  .text(d => d.data.pro + (showSliderPercent ? '%' : ''));


  let topicProgressG = cell.filter(d => d.depth === 1)
  .append('g')
  .on("click", clicked)
  .attr('transform', d => `translate(${rectWidth(d) - mainCircleWidth - topicCellPadding},` +
    ` ${rectHeight(d) / 2 - mainCircleRadius})`);

  let topicProgressContainerBG = topicProgressG
  .append('svg')
  .attr('width', mainCircleWidth)
  .attr('height', mainCircleWidth)
  .attr('viewBox', '0 0 100 100')
  .attr('x', 0)
  .style('filter', d => {
    let alphaArray = parseRGB(color(d.data.name));
  alphaArray.push(0.8);
  return `drop-shadow(${dropShadowParams} ${convertRGBArrayToString(alphaArray)})`;
  })
  .attr('stroke', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.8, true))
  .attr('stroke-width', 1)
  .attr('stroke-linecap', 'round')
  .attr('fill-opacity', 1)
  .attr('fill', d => {
    let baseColor = color(d.data.name);
  let bgColor = convertRGBAtoRGB(baseColor, 'white', 0.6);
  return convertRGBAtoRGB(color(d.data.name), bgColor, 0.4, true);
  });

  topicProgressContainerBG
  .append('path')
  .attr('d', `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 `);

  let topicProgressContainer = topicProgressG
  .append('svg')
  .attr('width', mainCircleWidth)
  .attr('height', mainCircleWidth)
  .attr('x', 0)
  .attr('viewBox', '0 0 100 100')
  .attr('fill-opacity', 1)
  .attr('fill', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.94, true));
  let topicProgressPie = topicProgressContainer
  .append('path')
  .attr('d', d => {
    let angle = 2 * Math.PI * computeProgress(d);
  if (angle === 2 * Math.PI) {
  return `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 z`;
  }
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  return `M 50 50 v -49 A 49,49 0 ${angle >= Math.PI ? 1 : 0},1 ${sin * 49 + 50} ${-cos * 49 + 50} z`;
  });

  let topicProgressTextSvg = topicProgressG
  .append('svg')
  .attr('x', (mainCircleRadius - subCircleRadius))
  .attr('y', (mainCircleRadius - subCircleRadius))
  .attr('width', subCircleWidth)
  .attr('height', subCircleWidth)
  .attr('viewBox', '0 0 100 100')
  .attr('stroke', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.8, true))
  .attr('stroke-width', 1)
  .attr('stroke-linecap', 'round')
  .attr('fill-opacity', 1)
  .attr('fill', d => convertRGBAtoRGB(color(d.data.name), 'white', 0.6, true));

  // topic progress text bg
  topicProgressTextSvg
  .append('path')
  .style('transform-origin', `${50}px ${0}px`)
  .style('transform', `rotate3d(0, 1, 0, 0)`)
  .attr('d', `M 50 50 m 48, 0 a 48,48 0 1,0 -96,0 a 48,48 0 1,0 96,0 `);

  let topicProgressText = topicProgressG
  .append('text')
  .attr('aria-hidden', true)
  .style("user-select", "none")
  .attr("pointer-events", "none")
  .style('transform-origin', `${mainCircleWidth}px ${0}px`)
  .style('transform', `rotate3d(0, 1, 0, 0)`)
  .text(d => `${parseInt(computeProgress(d) * 100)}%`)
  .attr('y', mainCircleRadius)
  .attr('x', mainCircleRadius)
  .attr("fill-opacity", 1)
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('fill', d => contrastCorrectedColor(d, 0.6, false))
  .style("font", `${subCircleWidth / 2.7}px sans-serif`);

  let focusLinkFactor = 1.2;
  // Create top left link icon
  let linkContainerG = cell.filter(d => d.depth >= 1 && d.data.link)
  .append('g')
  .attr('class', 'linkContainerG')
  .on('mouseenter', (_, p) => changeLinkFocus(p, linkContainerG, true))
  .on('mouseleave', (_, p) => changeLinkFocus(p, linkContainerG, false))
  .on("click", (_, d) => window.open(d.data.link ? d.data.link.replaceAll('\\\/', '/') :
    'https://www.know-center.tugraz.at/en/', '_blank'));

  let linkContainer = createElement(false);
  linkContainer
  .attr('aria-label', d => `Open link of ${d.data.name}`)
  .style('filter', d => {
    let alphaArray = parseRGB(color(d.depth === 1 ? d.data.name : d.parent.data.name));
  alphaArray.push(0.8);
  return `drop-shadow(${dropShadowParams} ${convertRGBArrayToString(alphaArray)})`;
  });

  linkContainer.append('path')
  .attr('d', roundedRect(linkContainerSize));

  let linkIconSvg = createElement(true);

  linkIconSvg
  .append('path')
  .attr('d', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71');
  linkIconSvg
  .append('path')
  .attr('d', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71');

  let backArrowG = cell.filter(d => d.depth === 1)
  .append('g')
  .on('click', clicked)
  .attr('cursor', 'zoom-out')
  .attr('class', 'backArrowG');
  let backArrowSvg = backArrowG.append('svg')
  .attr("width", 0)
  .attr("height", 0)
  .attr('viewBox', `0 0 100 100`)
  .attr('x', 0)
  .attr('y', 0)
  .attr("stroke-opacity", 1)
  .attr("fill-opacity", 0)
  .attr('stroke', d => contrastCorrectedColor(d, 0.7, true))
  .attr('stroke-width', 10)
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round');

  backArrowSvg
  .append('path')
  .attr('d', 'M 90,50 l -80,0 l 20,-20 M 10, 50 l 20, 20');

  if (depth2Child) {
  toggleZoomCursor();
  }
  let confirmationDialogShown = false;
  let blurDiv = d3.select('#' + treemapId).append('div')
  .style('height', '100vh')
  .style('width', '100vw')
  .style('max-width', `80ch`)
  .attr("class", "mainDiv")
  .style('display', 'inline')
  .style('left', "50%")
  .style('top', `-100%`)
  .style('z-index', -1)
  .style('position', 'fixed')
  .style('transform', 'translate(-50%, 10%)');
  const accessibilitySvg = blurDiv.append('svg')
  .attr('aria-labelledby', 'visualization-title')
  .attr('aria-describedby', 'visualization-desc')
  .attr('height', height)
  .attr('width', width)
  .style('position', 'absolute')
  .style('left', 0)
  .style('top', 0)
  .style('z-index', 100)
  .attr("viewBox", [0, 0, width, height]);
  let accessibilityCloseBG = accessibilitySvg.append('circle')
  .attr('filter', `drop-shadow(${dropShadowParams} rgba(0,0,0,0.5))`)
  .attr('cx', (width - lastY) / 2 + lastY)
  .attr('cy', yShift + colorPaletteSize / 2)
  .attr('r', colorPaletteBgRadius)
  .attr('cursor', 'pointer')
  .attr('fill', `url(#gradient-${treemapId})`)
  .on('click', toggleAccessibilityDialog);
  let accessibilityCloseIcon = accessibilitySvg.append('svg')
  .attr('x', (width - lastY - colorPaletteSize) / 2 + lastY)
  .attr('y', yShift)
  .attr('width', colorPaletteSize)
  .attr('height', colorPaletteSize)
  .attr('viewBox', '0 0 30 30')
  .attr('cursor', 'pointer')
  .attr('fill', 'none')
  .attr('stroke', 'black')
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-width', 3);
  accessibilityCloseIcon.append('path')
  .attr('d', rejectPath)
  .on('click', toggleAccessibilityDialog);

  let accessibilityData = [{
    data: treemapAccessibilityText
  }];

  let accessibilityFontSizeMin = 14;
  let accessibilityFontSize = Math.max(accessibilityWidth / 19, accessibilityFontSizeMin);
  let accessibilityFontLineHeight = accessibilityFontSize === accessibilityFontSizeMin ? 17 : accessibilityFontSize + 2;
  let accessibilityTextDiv = blurDiv.append('div')
  .style('text-align', 'center')
  .style('max-width', `${width}px`)
  .style('height', `${height}px`)
  .style('top', '0')
  .style('position', 'absolute');
  let accessibilityDialogText = accessibilityTextDiv.selectAll(null)
  .data(accessibilityData)
  .join('p')
  .attr('class', 'accessibilityText')
  .style('background-image', 'linear-gradient(#eee, #ddd)')
  .style('margin-inline', `${(2 * colorPaletteSize + (width - lastY) / 2) * 100 / width}%`)
  .style('padding', `1em`)
  .style('box-sizing', 'box-border')
  .style('border-radius', `1em`)
  .style('max-height', '90%')
  .style('overflow-y', 'scroll')
  .attr('tabindex', 1)
  .html(d => d.data)
  .style("font", `${accessibilityFontSize}px sans-serif`);

  let accessibilityDialogSVGHeight = 2 * accessibilityDialogPathRadius +
    accessibilityFontLineHeight * (accessibilityDialogText._groups[0][0].children.length);

  blurDiv
  .attr('height', accessibilityDialogSVGHeight + 2 * colorPaletteBgRadius);
  accessibilitySvg
  .attr('height', accessibilityDialogSVGHeight + 2 * colorPaletteBgRadius + 10)
  .attr("viewBox", `0 0 ${width} ${accessibilityDialogSVGHeight + 2 * colorPaletteBgRadius + 10}`);

  let clickedTopic = null;
  let savedTopic = null;
  let addedTopic = null;


  /**
  * Zooms in on a learning goal, zooms out to the main view
  * @param {object} _ Click event. Unused.
  * @param {object} p The clicked d3 node.
  *
  */
  function clicked(_, p) {
  if (zooming) { return; }
  if (!isZoomedIn && highlightedGoals && highlightedGoals.includes(p)) {
  unhighlightLearningGoals();
  }
  if (p.depth === 2) { p = p.parent; }
  clickedTopic = p;
  if (confirmationDialogShown) { return shakeConfirmationDialog(); }
  svg.attr("viewBox", [0, 0, width, isZoomedIn ? height : stdHeight]);
  zooming = true;
  focus = focus === p ? p = p.parent : p;
  const appliedHeight = isZoomedIn ? height : stdHeight;
  root.each(d => {
    if (!isZoomedIn && isSmallScreen && d.depth === 1) {
  d.target = {
    x0: (d.x0 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  x1: (d.x1 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  y0: d.y0 - p.y0,
  y1: isZoomedIn ? d.y1 - p.y0 : d.parent.y1,
  };
  }
  else if (!isZoomedIn && isSmallScreen && d.depth === 2) {
    d.target = {
    x0: (d.x0 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  x1: (d.x1 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  y0: isZoomedIn ? d.y0 - p.y0 : depth1Child.parent.y1,
  y1: d.y1 - p.y0,
  };
  }
  else {
  d.target = {
    x0: (d.x0 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  x1: (d.x1 - p.x0) / (p.x1 - p.x0) * appliedHeight,
  y0: d.y0 - p.y0,
  y1: d.y1 - p.y0,
  };
  }
  });
  if (isZoomedIn && isSmallScreen) {
  root.each(d => {
    if (d.depth === 2) {
  d.target.y0 = depth2Child ? depth2Child.y1 : d.target.y0;
  d.target.y1 = d.target.y0;
  }
  });
  }



  let t = cell.transition().duration(transitionDuration)
  .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);


  if (isSmallScreen && isZoomedIn) {
  addedTopic.transition(t)
  .attr('opacity', 0)
  .attr('fill-opacity', 0);
  text.filter(d => d === clickedTopic)
  .text('')
  .append(() => savedTopic.node());
  text.filter(d => d === clickedTopic).transition().duration(transitionDuration)
  .style('letter-spacing', 'initial')
  .style('writing-mode', 'lr')
  .style('text-orientation', 'initial')
  .attr('y', d => rectHeight(d) / 2)
  .attr('x', 4)
  .style('dominant-baseline', 'initial')
  .style('text-anchor', 'start')
  .style("font", d => `${fontSize(d)}px sans-serif`)
  .end().then(() => maintspan.filter(d => d === clickedTopic)
    .attr('opacity', 1)
  .attr('fill-opacity', 1));
  savedTopic = null;
  addedTopic = null;
  }
  else if (isSmallScreen && !isZoomedIn) {
    rect.filter(d => d.depth === 2)
  .attr('display', 'initial');
  savedTopic = maintspan.filter(d => d === clickedTopic).transition(t)
  .attr('opacity', 0)
  .attr('fill-opacity', 0);
  maintspan.filter(d => d === clickedTopic).remove();
  addedTopic = text.filter(d => d === clickedTopic).append("tspan")
  .text(d => d.data.name)
  .attr('opacity', 0)
  .attr('fill-opacity', 0)
  .attr('y', 0)
  .attr('x', 0)
  .attr('fill', d => contrastCorrectedColor(d, 0.6, d.depth === 2))
  .style("font", d => `${rectWidth(d.target) / 2}px sans-serif`)
  .style('dominant-baseline', 'central')
  .style('text-anchor', 'middle');
  text.filter(d => d === clickedTopic)
  .style('letter-spacing', '.3em')
  .style('writing-mode', 'vertical-lr')
  .style('text-orientation', 'upright');
  setTimeout(() => {
    fitVerticalTopic();
  addedTopic.filter(d => d === clickedTopic)
  .attr('x', d => rectWidth(d.target) / 2)
  .attr('y', (d, i, n) => rectHeight(d.target) / 2 - n[i].getBBox().width / 2 + 30);
  addedTopic.transition().duration(300)
  .attr('opacity', 1)
  .attr('fill-opacity', 1);
  }, transitionDuration);
  }
  if (isSmallScreen) {
  toggleLinkButton(linkContainer.filter(d => d === clickedTopic), t, false, !isZoomedIn);
  toggleLinkButton(linkIconSvg.filter(d => d === clickedTopic), t, true, !isZoomedIn);
  backArrowSvg.filter(d => d === clickedTopic).transition(t)
  .attr("width", d => isZoomedIn ? 0 : rectWidth(d.target) * 0.8)
  .attr("height", d => isZoomedIn ? 0 : rectWidth(d.target) * 0.8)
  .attr('x', d => isZoomedIn ? 0 : rectWidth(d.target) * 0.1);
  }

  if (isZoomedIn) {
  rect.filter(d => d.depth === 0).attr('tabindex', 0);
  rect.filter(d => d.depth === 2).attr('tabindex', null);
  setDepth1AriaLabel();
  }
  else {
  rect.filter(d => d.depth === 2 && d.parent === p).attr('tabindex', 0);
  rect.filter(d => d.depth === 0).attr('tabindex', null);
  rect.filter(d => d.depth === 1 && d !== p).attr('tabindex', null);
  rect.filter(d => d.depth === 1 && d === p)
  .attr('aria-label', d => {
    let content = `Topic ${d.data.name}. Progress ${parseInt(computeProgress(d) * 100)}%.`;
  if ('children' in d) {
  content += `${d.children.length} learning goal${d.children.length > 1 ? 's' : ''}, ` +
    `press enter to go back to the topic view. Use tab to navigate through it.`;
  }
  content += `${d.data.link ? 'External link is available, press control and enter to open it.' : ' '}`;
  return content;
  });
  }
  rect.transition(t)
  .attr("height", d => !isZoomedIn ? rectHeight(d.target) : d.x1 - d.x0)
  .attr("width", d => {
    if (!isZoomedIn) { return rectWidth(d.target); }
  if (d.depth < 2 || !isSmallScreen) { return d.y1 - d.y0; }
  return 0;
  });

  toggleLinkButton(linkContainer.filter(d => d.depth === 2), t, false, isZoomedIn);
  toggleLinkButton(linkIconSvg.filter(d => d.depth === 2), t, true, isZoomedIn);

  learningGoalProgressBar.transition(t)
  .attr('y', d => isZoomedIn ? 0 : rectHeight(d.target) - learningGoalProgressBarHeight(d))
  .attr('height', d => learningGoalProgressBarHeight(d))
  .attr("width", d => {
    if (isZoomedIn && isSmallScreen) { return 0; }

  let progress = computeProgress(d);
  if (isZoomedIn) { return rectWidth(d) * progress; }
  if (!isZoomedIn && isSmallScreen) {
  return computeLearningGoalProgressBarWidth(d, progress);
  }
  return computeLearningGoalProgressBarWidth(d);
  });
  moveTopicProgress(t);

  let timeDiff = 100;
  const currentZoomState = isZoomedIn;
  for (let i = 0; i < highestNumberChildren; i++) {
  let newDuration = transitionDuration + timeDiff * i;
  let newT = d3.transition().duration(newDuration);
  resetSlider((d) => d.parent.children.indexOf(d) === i, newT, isZoomedIn);

  // In order to silence grunt, and to improve performance,
  // these functions are defined outside the following loop, instead of using anonymous functions.

  const
  xAttrSvg = d => {
    if (currentZoomState && !isSmallScreen) { return d.proY0; }
  if (currentZoomState && isSmallScreen) { return 0; }
  let newVal = computeCircleContainerXPosition(d);
  return d.data.pro === 100 ? newVal + 1 : newVal;
  },
  yAttrSvg = d => currentZoomState ? (rectHeight(d) - sliderSize(d)) / 2 : computeCircleContainerYPosition(d, true),
  widthHeightAttr = d => currentZoomState ? sliderSize(d) : circleEnlargeFactor * sliderSize(d);

  const
  xAttrText = d => {
    if (currentZoomState && !isSmallScreen) {
  return d.proY0 + sliderSize(d) / 2;
  }
  if (currentZoomState && isSmallScreen) {
  return sliderSize(d) / 2;
  }
  let newVal = computeCircleTextXPosition(d);
  return d.data.pro === 100 ? newVal + 1 : newVal;
  },
  yAttrText = d => currentZoomState ? rectHeight(d) / 2 : rectHeight(d.target) - 4.5,
  content = d => d.data.pro + (!currentZoomState || sliderTextShowPercent(d) ? '%' : ''),
  font = (d) => `${sliderTextSize(d, currentZoomState)}px sans-serif`;
  sliderSvg.filter(d => d.parent.children.indexOf(d) === i).transition(newT)
  .attr('x', xAttrSvg)
  .attr('y', yAttrSvg)
  .attr('width', widthHeightAttr)
  .attr('height', widthHeightAttr)
  .attr('cursor', isZoomedIn ? '' : 'pointer');
  sliderText.filter(d => d.parent.children.indexOf(d) === i).transition(newT)
  .attr('dominant-baseline', isZoomedIn ? 'central' : 'auto')
  .attr("x", xAttrText)
  .attr('y', yAttrText)
  .text(content)
  .style('font', font);
  }
  sliderPath.transition(t).attr('d', isZoomedIn ? `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0` :
    `M 50 100 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0`);


  isZoomedIn = !isZoomedIn;
  maintspan.filter(d => d.depth > 0).transition('hideText').duration(hideTextDuration)
  .style('fill-opacity', 0)
  .style('opacity', 0).end().then(() => {
    maintspan.filter(d => d.depth > 0)
  .style("font", d => `${fontSize(d)}px sans-serif`);
  });
  maintspan.filter(d => d.depth > 0).transition("reduceWidth").duration(transitionDuration)
  .attr("width", d => d.target.y1 - d.target.y0).end().then(() => {
    text.filter(d => d.depth === 2)
  .attr('display', 'initial');
  toggleZoomCursor();
  if (!isZoomedIn) {
  // Zooming out
  maintspan.filter(d => d.depth === 2)
  .call(truncateText, depth2Width * 0.95, true);
  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  (depth1Width - mainCircleWidth - 3 * topicCellPadding),
  false,
  (el) => rectHeight(el.target),
  topicCellPadding);
  }
  else if (isSmallScreen) {
    // Zooming in
  maintspan.filter(d => d.depth === 2)
  .style("opacity", 1)
  .style("fill-opacity", 1);
  maintspan.filter(d => d.depth === 2)
  .call(
  wrapText,
  (rectWidth(depth2Child.target) - 2 * topicCellPadding),
  false,
  (el) => {
  return computeCircleContainerYPosition(el, true) -
    circleEnlargeFactor * sliderSize(el) / 4;
  },
  topicCellPadding);

  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  (depth1Width - 2 * topicCellPadding),
  false,
  (el) => {
  return rectHeight(el.target) -
    4 * topicProgressSizeFactor() * mainCircleRadius;
  },
  topicCellPadding);
  }
  else {
  // Zooming in
  maintspan.filter(d => d.depth === 2)
  .call(
  wrapText,
  (depth2Width - 2 * topicCellPadding),
  false,
  (el) => {
  return computeCircleContainerYPosition(el, true) +
    circleEnlargeFactor * sliderSize(el) / 4;
  },
  topicCellPadding);

  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  (depth1Width - 2 * topicCellPadding),
  false,
  (el) => {
  return rectHeight(el.target) -
    4 * topicProgressSizeFactor() * mainCircleRadius;
  },
  topicCellPadding);
  }
  if (!isSmallScreen) {
  maintspan.filter(d => d.depth > 0).transition().duration(hideTextDuration)
  .style('fill-opacity', 1)
  .style('opacity', 1).end().then(() => { zooming = false; });
  } else {
    maintspan.filter(d => d.depth === 1).transition().duration(hideTextDuration)
  .style('fill-opacity', 1)
  .style('opacity', 1).end().then(() => { zooming = false; });
  if (isZoomedIn) {
  maintspan.filter(d => d.depth === 2).transition().duration(hideTextDuration)
  .style('fill-opacity', 1)
  .style('opacity', 1).end().then(() => { zooming = false; });
  }
  }
  });
  if (!isZoomedIn) {
  maintspan.filter(d => d.depth === 2).transition('resetChild2Align').duration(transitionDuration)
  .attr('y', d => rectHeight(d.target) / 2);
  }
  maintspan.filter(d => d.depth === 0).transition('resetTitlePos').duration(transitionDuration)
  .attr('y', d => rectHeight(d.target) / 2);
  }
  /**
  * Creates a color ramp, given its name and index
  * @param {string} name Name of the colorscheme
  * @param {int} colorschemeIndex Index of the colorscheme
  * @returns {Array} list with d3 colors
  */
  function ramp(name, colorschemeIndex) {
  let colors;
  let n = data.children.length + 2;
  let interpolate = null;
  if (name in additionalColors) {
  interpolate = d3.interpolateRgbBasis(additionalColors[name]);
  } else {
    interpolate = d3[`interpolate${name}`];
  }
  colors = [];
  for (let i = 0; i < n - 1; ++i) {
  let colorArray = parseRGB(interpolate(i / (n - 1)));
  let correctedColor = convertRGBAtoRGB(colorArray, 'white', 0.6, true);
  colors.push({ index: i, parentIndex: colorschemeIndex, colorscheme: name, color: d3.rgb(correctedColor).hex() });
  }
  return colors;
  }
  /**
  * Computes which color a text should have given the background
  * @param {Object} element Element where the text should be, used to derive the bg color
  * @param {float} alpha Alpha of the background color
  * @param {bool} isDoubled Whether the element is on top of another element with the same bg color
  * @returns {string} Color that the text should have
  */
  function contrastCorrectedColor(element, alpha, isDoubled) {
  let bgColor = color(element.depth === 2 ? element.parent.data.name : element.data.name);
  let rgba = parseRGB(bgColor);
  let rgb = convertRGBAtoRGB(rgba, 'white', alpha);
  let doubledRgb = convertRGBAtoRGB(rgba, rgb, alpha);
  let L1 = computeLuminance(rgb);
  let L2 = computeLuminance(doubledRgb);
  let black = [0, 0, 0];
  let white = [240, 240, 240];

  let blackLuminance = computeLuminance(black);
  let whiteLuminance = computeLuminance(white);
  let contrastWhite = computeContrastRatio(whiteLuminance, L1);
  let contrastBlack = computeContrastRatio(L1, blackLuminance);
  let contrastWhiteDoubled = computeContrastRatio(whiteLuminance, L2);
  let contrastBlackDoubled = computeContrastRatio(L2, blackLuminance);
  if (!isDoubled) {
  return contrastWhite > contrastBlack ? 'rgb(240, 240, 240)' : 'black';
  }
  return contrastWhiteDoubled > contrastBlackDoubled ? 'rgb(240, 240, 240)' : 'black';
  }
  /**
  * Changes the focus of a link element
  * @param {object} p Element where the link element lies
  * @param {object} el Link element to resize
  * @param {bool} isFocused Whether the size should be increased or decreased
  */
  function changeLinkFocus(p, el, isFocused) {
  if (zooming || !el || (isFocused && linkEnlarged) || (!isFocused && !linkEnlarged) || resizingLink) {
  return;
  }
  if (isFocused) { linkEnlarged = true; }

  resizingLink = true;
  let t = cell.transition().duration(300);
  resizeLinkElement(linkContainer.filter(d => d === p),
  isFocused ? linkContainerSize * focusLinkFactor : linkContainerSize, t);
  resizeLinkElement(linkIconSvg.filter(d => d === p),
  isFocused ? linkIconSize * focusLinkFactor : linkIconSize, t)
  .end()
  .then(() => {
    resizingLink = false;
  if (!isFocused) { linkEnlarged = false; }
  });
  }
  /**
  * Resizes an svg element
  * @param {object} element Element to resize
  * @param {float} size Size the element should have
  * @param {object} trans Transition to apply
  * @returns {object} Returns the element for chaining
  */
  function resizeLinkElement(element, size, trans) {
  return element.transition(trans)
  .attr('width', size)
  .attr('height', size);
  }
  /**
  * Computes the progress of a topic
  * @param {object} d Topic
  * @returns {float} Average progress of the topic
  */
  function computeProgress(d) {
  if ('pro' in d.data) { return d.data.pro / 100; }
  let percent = 0;
  d.data.children.forEach((child) => { percent += child.pro; });
  if (!d.data.children.length) { return 0; }
  return percent / d.data.children.length / 100;
  }

  /**
  * Shows or hides an element
  * @param {object} el Element to toggle
  * @param {object} trans Transition to use
  * @param {bool} isIcon Whether it is the icon or the svg container
  * @param {bool} hide Whether the icon should be shown or not
  */
  function toggleLinkButton(el, trans, isIcon, hide) {
  let size = isIcon ? linkIconSize : linkContainerSize;
  let viewBox = isIcon ? 23 : linkContainerSize;
  el.transition(trans)
  .attr("width", hide ? 0 : size)
  .attr("height", hide ? 0 : size)
  .attr('viewBox', `0 0 ${viewBox} ${viewBox}`);
  }

  /**
  * Truncates the text of an element so that it fits into the parent
  * @param {object} text List of texts to truncate
  * @param {float} width Max width the text can have
  * @param {bool} begin Whether it is the initial state
  */
  function truncateText(text, width, begin = false) {
  text.each(function() {
    var text = d3.select(this),
  line = text.data()[0].data.name.split(/\s+/),
  x = text.attr("x"),
  tspan = text.text(null)
  .append("tspan")
  .attr("x", x)
  .attr("dy", "0em"),
  depth = text.data()[0].depth;
  tspan.text(line.join(" "));
  let currentWidth = depth < 2 ? width * 2.3 : width * 1.35;
  if (begin) { currentWidth = width; }

  if (tspan.node().getComputedTextLength() > currentWidth) {
  line.pop();
  line.push(' ...');
  tspan.text(line.join(" "));
  }
  while (tspan.node().getComputedTextLength() > currentWidth) {
  line.pop();
  line.pop();
  line.push(' ...');
  tspan.text(line.join(" "));
  }
  });
  }

  /**
  * Truncates the title if it is too big
  * @param {object} rootText Element where the text is
  * @param {object} rootNode Parent of the rootText
  * @param {object} rootTspan Tspan of title element
  * @param {float} padding Padding the text should have
  */
  function truncateTitle(rootText, rootNode, rootTspan, padding = 0) {
  let originalText = widgetTitle;
  while (rootText.getBBox().height + 2 * padding >= rootNode.querySelector('.rect').getBBox().height) {
  originalText = originalText.substring(0, originalText.length - 1);
  rootTspan.html(originalText + U_ELLIPSIS);
  if (originalText.length < 1) {
  break;
  }
  }
  }

  /**
  * Wraps the text to a newline if it doesn't fit inside its parent
  * @param {object} element List of elements where the text should be wrapped
  * @param {float} width Max width of the text
  * @param {bool} dynamicResizing Whether to use dynamicResizing of the text
  * @param {func} computeMaxHeight Function to compute the max height
  * @param {float} padding Padding the text should have
  * @param {int} retryN Counter to avoid unlimited recursion
  */
  function wrapText(element, width, dynamicResizing, computeMaxHeight, padding = 0, retryN = 0) {
  let retry = false;
  let elDepth = 0;
  element.each(function() {
    var text = d3.select(this),
  nodeData = text.data()[0],
  words = nodeData.data.name.split(/\s+/).reverse().filter(el => el), // filter to remove empty strings
  word,
  line = [],
  lineHeight = fontSize(nodeData), // ems
  tspan = text.text(null)
  .append("tspan")
  .attr('text-anchor', 'middle')
  .attr('x', 0)
  .attr('dx', 0),
  depth = nodeData.depth,
  added = [],
  textNode = text._groups[0][0],
  currentWidth = width;
  let maxHeight = computeMaxHeight(nodeData);
  elDepth = nodeData.depth;
  if (dynamicResizing) {
  lineHeight /= (nodeData.depth === 1 ? 25 : 8) + 4;
  if (depth === 0) {
  currentWidth = 1;
  words = nodeData.data.name.split('').reverse();
  }
  else if (depth === 1) { currentWidth *= 0.4; }
  else { currentWidth *= 0.8; }
  }

  while ((word = words.pop())) {
  line.push(word);
  added.push(word);
  tspan.html(line.join(" "));
  if (!isZoomedIn && nodeData.depth === 1 &&
    tspan.node().getComputedTextLength() > depth1Width - mainCircleWidth - 1.5 * topicCellPadding &&
  line.length === 1) {
  retry = true;
  }
  else if (tspan.node().getComputedTextLength() > currentWidth && line.length > 1) {
    line.pop();
  //If text too long add ... and break
  if (textNode.getBoundingClientRect().height + 2 * lineHeight > maxHeight) {
  line.pop();
  line.push(U_ELLIPSIS); // unicode for ellipsis ...
  tspan.html(line.join(" "));
  break;
  }
  tspan.text(line.join(" "));
  line = [word];
  tspan = text.append("tspan")
  .attr("dy", lineHeight + "px")
  .attr('text-anchor', 'middle')
  .attr('x', 0)
  .html(word);
  }
  }
  text.attr('y', (maxHeight - lineHeight * (text.node().childNodes.length - 1.5)) / 2);

  let someLineNonEmpty = false;
  for (let child of text.node().childNodes) {
  d3.select(child).attr('x', padding + width / 2);
  if ((nodeData.depth === 1 && child.getComputedTextLength() > width + 1.5 * topicCellPadding ||
    child.getBBox().height > rect.filter(d => d === nodeData).node().getBBox().height)
  && !isZoomInDisabled) {
  allElementSmallEnough = false;
  disableZoomIn();
  } else if (nodeData.depth === 1 && child.getComputedTextLength() > width + 1.5 * topicCellPadding) {
    allElementSmallEnough = false;
  } else if (d3.select(child).html() !== String.fromCharCode(ELLIPSIS_CODE)) {
    someLineNonEmpty = true;
  }
  }
  if (nodeData.depth === 1 && !someLineNonEmpty && !isZoomInDisabled) {
  zoomOutText().then(() => {
    allElementSmallEnough = false;
  disableZoomIn();
  });
  }
  });
  // Avoid unlimited recursion
  if (elDepth === 1 && retry && retryN < 50) {
  currentTextZoom -= zoomDelta;
  maintspan.style("font", d => `${fontSize(d)}px sans-serif`);
  return wrapText(element,
    width,
  dynamicResizing,
  computeMaxHeight,
  padding,
  retryN + 1);
  }
  if (allElementSmallEnough && isZoomInDisabled) {
  enableZoomIn();
  }
  }


  /**
  * Toggles the zoom in button
  * @param {bool} new_val New value of isZoomInDisabled
  */
  function toggleZoomIn(new_val) {
  zoomRightHalfSvg.attr('cursor', !isZoomInDisabled ? 'default' : 'pointer')
  .on('click', !isZoomInDisabled ? null : zoomInText);
  zoomRightHalf.attr('fill', !isZoomInDisabled ? '#ababab' : `url(#gradient-${treemapId})`);
  isZoomInDisabled = new_val;
  }

  /**
  * Wrapper for toggleZoomIn, disables the zoom in button
  */
  function disableZoomIn() {
  toggleZoomIn(true);
  }
  /**
  * Wrapper for toggleZoomIn, enables the zoom in button
  */
  function enableZoomIn() {
  toggleZoomIn(false);
  }

  /**
  * Creates an svg element, that is used on the top left corner of each rect, where the link icon is
  * @param {bool} isIcon Whether it is the icon or the container element
  * @returns {object} The created element
  */
  function createElement(isIcon) {
  // This function creates an svg element, that is used on the top left corner of each rect, where the link icon is
  let size = isIcon ? linkIconSize : linkContainerSize;
  let viewBox = isIcon ? 23 : linkContainerSize;
  let element = linkContainerG
  .append("svg")
  .attr("width", d => d.depth === 1 ? size : 0)
  .attr("height", d => d.depth === 1 ? size : 0) // On purpose same size
  .attr('viewBox', `0 0 ${viewBox} ${viewBox}`)
  .attr('x', isIcon ? 1 : 0)
  .attr('y', isIcon ? 1 : 0)
  .attr('class', isIcon ? 'linkIconSvg' : '')
  .attr("fill-opacity", isIcon ? 0 : 0.6)
  .attr("stroke-opacity", d => contrastCorrectedColor(d, 0.7, true) === 'white' ? 1 : 0.5)
  .attr('stroke', d => isIcon ? contrastCorrectedColor(d, 0.7, true) : 'none')
  .attr('stroke-width', 2)
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round')
  .attr('transform', '')
  .attr('cursor', 'pointer')
  .attr("fill", d => {
    if (isIcon) { return 'none'; }
  return color(d.depth > 1 ? d.parent.data.name : d.data.name);
  });
  return element;
  }

  /**
  * Returns an svg string for a drop shape, with a rounded bottom right corner
  * @param {float} radius Radius of the rounded corner
  * @returns {string} The svg string
  */
  function roundedRect(radius) {
  return "M0,0"
    + "h" + (radius)
  + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
  + "z";
  }

  let colorschemesOpened = false;
  /**
  * Open and closes the colorscheme list
  */
  function toggleColorSchemes() {
  if (!isSmallScreen) {
  colorPaletteBg.transition().duration(100).attr('fill', '#fefefe')
  .end().then(() => colorPaletteBg.transition().duration(100).attr('fill', `url(#gradient-${treemapId})`));
  }
  let tempWidth = 0;
  let delay = 100;
  let hTransDuration = 500;
  let vTransDuration = 1000;
  if (colorschemesOpened) {
  tempWidth = colorSchemeHolderHeight;
  colorSchemeSamplePath.transition().ease(d3.easeExp).duration(d => hTransDuration + d.index * delay)
  .attr(
  'd',
  roundedCornersRect(colorSchemeHolderWidth,
  colorSchemeHolderHeight,
  tempWidth,
  colorSchemeHolderHeight,
  cornerRadius
  )
  );
  colorSchemeBox.transition().ease(d3.easeExp).duration(d => hTransDuration + d.parentIndex * delay)
  .attr('x', (colorSchemeHolderWidth - colorBoxWidth) / 2)
  .end()
  .then(() => {
    colorSchemeSample.transition().ease(d3.easeExp).duration(d => vTransDuration / 2 + d.index * delay)
  .attr('y', yShift + colorPaletteSize / 2 - colorSchemeHolderHeight / 2)
  .attr('x', (width - lastY - colorSchemeHolderWidth) / 2 + lastY);
  });
  }
  else {
  tempWidth = colorSchemeHolderWidth;
  colorSchemeSample.transition().ease(d3.easeBack).duration(d => vTransDuration + d.index * delay)
  .attr('y', d => {
    if (useDoubleColumnColorScheme) {
  return yShift + 2 * colorPaletteBgRadius +
    (colorSchemeHolderHeight + 10) * (d.index % Math.ceil(colorSchemesNames.length / 2));
  }
  return yShift + 2 * colorPaletteBgRadius + (colorSchemeHolderHeight + 10) * d.index;
  })
  .attr('x', d => {
    if (useDoubleColumnColorScheme) {
  return d.index < Math.ceil(colorSchemesNames.length / 2) ? (width - lastY) / 4 + lastY - colorSchemeHolderWidth / 2 :
    (width - lastY) * 3 / 4 + lastY - colorSchemeHolderWidth / 2;
  }
  return (width - lastY - colorSchemeHolderWidth) / 2 + lastY;
  })
  .end()
  .then(() => {
    colorSchemeSamplePath.transition().ease(d3.easeExp).duration(d => hTransDuration + d.index * delay)
  .attr(
  'd',
  roundedCornersRect(colorSchemeHolderWidth,
  colorSchemeHolderHeight,
  tempWidth,
  colorSchemeHolderHeight,
  cornerRadius
  )
  );
  colorSchemeBox.transition().ease(d3.easeExp).duration(d => hTransDuration + d.parentIndex * delay)
  .attr('x', d => cornerRadius + d.index * colorBoxWidth);
  });
  }
  colorschemesOpened = !colorschemesOpened;

  }
  /**
  * Gets the colorscheme to use. If one is saved in localStorage, that is used
  * otherwise the default 'custom'
  */
  function getColorScheme() {
  let savedColorschemes = localStorage.getItem(colorschemeStorageName);
  let name = '';
  if (!savedColorschemes) {
  name = 'custom';
  let newObj = {};
  newObj[treemapId] = name;
  localStorage.setItem(colorschemeStorageName, JSON.stringify(newObj));
  }
  else {
  try {
  savedColorschemes = JSON.parse(savedColorschemes);
  if (!(treemapId in savedColorschemes) || !colorSchemesNames.includes(savedColorschemes[treemapId])) {
  savedColorschemes[treemapId] = "Rainbow";
  localStorage.setItem(colorschemeStorageName, JSON.stringify(savedColorschemes));
  }
  name = savedColorschemes[treemapId];
  } catch (e) {
    name = "Rainbow";
  }
  }

  let interpolate = null;
  if (name in additionalColors) {
  interpolate = d3.interpolateRgbBasis(additionalColors[name]);
  } else { interpolate = d3[`interpolate${name}`]; }

  return interpolate;
  }

  /**
  * Changes the chosen colorscheme
  * @param {string} name Name of the chosen colorscheme
  */
  function changeColorScheme(name) {
  let savedColorschemes;

  try {
  savedColorschemes = localStorage.getItem(colorschemeStorageName);
  if (!savedColorschemes) { savedColorschemes = {}; }
  else { savedColorschemes = JSON.parse(savedColorschemes); }
  } catch (e) {
    savedColorschemes = {};
  }
  savedColorschemes[treemapId] = name;
  localStorage.setItem(colorschemeStorageName, JSON.stringify(savedColorschemes));
  let interpolate = null;
  if (name in additionalColors) {
  interpolate = d3.interpolateRgbBasis(additionalColors[name]);
  } else { interpolate = d3[`interpolate${name}`]; }

  color = d3.scaleOrdinal(d3.quantize(interpolate, data.children.length + 2));
  let t = d3.transition().duration(300);
  rect.transition(t).attr("fill", d => {
    if (!d.depth) { return color(d.data.name); }
  while (d.depth > 1) { d = d.parent; }
  return color(d.data.name);
  });
  learningGoalProgressBar.transition(t).attr("fill", d => color(d.parent.data.name));
  linkContainer.transition(t).attr("fill", d => {
    return color(d.depth > 1 ? d.parent.data.name : d.data.name);
  });
  linkContainer.style('filter', d => {
    let alphaArray = parseRGB(color(d.depth === 1 ? d.data.name : d.parent.data.name));
  alphaArray.push(0.8);
  return `drop-shadow(${dropShadowParams} ${convertRGBArrayToString(alphaArray)})`;
  });
  linkIconSvg.transition(t)
  .attr('stroke', d => contrastCorrectedColor(d, 0.7, true))
  .attr('stroke-opacity', d => contrastCorrectedColor(d, 0.7, true) === 'white' ? 1 : 0.5);
  sliderSvg.transition(t).attr('fill', d => color(d.parent.data.name));
  sliderText.transition(t).attr('fill', d => contrastCorrectedColor(d, 1, false));
  sliderAcceptSvg.transition(t).attr('fill', d => color(d.parent.data.name, 1, false));
  sliderRejectSvg.transition(t).attr('fill', d => color(d.parent.data.name, 1, false));
  sliderRejectIcon.transition(t).attr('stroke', d => contrastCorrectedColor(d, 1, false));
  sliderAcceptIcon.transition(t).attr('stroke', d => contrastCorrectedColor(d, 1, false));
  topicProgressContainerBG
  .style('filter', d => {
    let alphaArray = parseRGB(color(d.data.name));
  alphaArray.push(0.8);
  return `drop-shadow(${dropShadowParams} ${convertRGBArrayToString(alphaArray)})`;
  });
  topicProgressContainerBG.transition(t)
  .attr('stroke', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.8, true))
  .attr('fill', d => {
    let baseColor = color(d.data.name);
  let bgColor = convertRGBAtoRGB(baseColor, 'white', 0.6);
  return convertRGBAtoRGB(color(d.data.name), bgColor, 0.4, true);
  });
  topicProgressContainer.transition(t)
  .attr('fill', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.94, true));
  topicProgressTextSvg.transition(t)
  .attr('stroke', d => convertRGBAtoRGB(color(d.data.name), 'black', 0.8, true))
  .attr('fill', d => convertRGBAtoRGB(color(d.data.name), 'white', 0.6, true));
  topicProgressText.transition(t)
  .attr('fill', d => contrastCorrectedColor(d, 0.6, false));

  maintspan.transition(t)
  .attr('fill', d => {
    return contrastCorrectedColor(d, 0.6, d.depth === 2);
  });


  }
  /**
  * Returns an svg string for a rectangle with rounded corners
  * @param {float} viewBoxWidth viewBoxWidth
  * @param {float} viewBoxHeight viewBoxHeight
  * @param {float} width Width of the rectangle
  * @param {float} height Height of the rectangle
  * @param {float} radius Radius of the rounded corners
  * @returns {string} The svg string
  */
  function roundedCornersRect(viewBoxWidth, viewBoxHeight, width, height, radius) {
  return `M ${viewBoxWidth / 2},${(viewBoxHeight - height) / 2}
h ${width / 2 - radius}
  a ${radius} ${radius} 0 0 1 ${radius} ${radius}
  v ${height - 2 * radius}
  a ${radius} ${radius} 0 0 1 ${-radius} ${radius}
  h ${-(width - 2 * radius)}
  a ${radius} ${radius} 0 0 1 ${-radius} ${-radius}
  v ${-(height - 2 * radius)}
  a ${radius} ${radius} 0 0 1 ${radius} ${-radius} z`;
  }

  /**
  * Appends a circle path with a whole
  * @param {object} element Element to append the path to
  * @param {float} cx Center x of the circle
  * @param {float} cy Center y of the circle
  * @param {float} radius Radius of the circle
  * @param {float} innerRadiusFactor Ratio of the inner circle
  * @returns {object} The element for chaining
  */
  function appendEmptyCirclePath(element, cx, cy, radius, innerRadiusFactor) {
  return element.append('path')
  .attr('d', `M ${cx},${cy} A ${radius} ${radius} 0 1 0 ${cx} ${cy + 2 * radius} ` +
    `A ${radius} ${radius} 0 1 0 ${cx} ${cy} Z M ${cx} ${cy + radius / innerRadiusFactor} ` +
  `A ${radius / innerRadiusFactor} ${radius / innerRadiusFactor} 0 1 1 ${cx} ${cy + 3 * radius / innerRadiusFactor} ` +
  `A ${radius / innerRadiusFactor} ${radius / innerRadiusFactor} 0 1 1 ${cx} ${cy + radius / innerRadiusFactor} Z`);
  }

  let magnifyIncrease = depth2Child ? sliderSize(depth2Child) / 3.6 : 1;
  /**
  * Perform changes when slider is moved
  * @param {event} e Mouse move event
  */
  function performChanges(e) {
  if (!isZoomedIn || !changingProgress || !objectToMove) { return; }

  let svgP = null;
  let xValue = null;
  sliderSvg.filter(d => d === objectToMove).attr('x', (d, idx, nodes) => {
    let parent = nodes[idx].parentElement.parentElement;
  let parentRightBorder = parent.childNodes[0].getBoundingClientRect().right;
  let parentLeftBorder = parent.childNodes[0].getBoundingClientRect().left;
  let currentAttribute = parseFloat(d3.select(nodes[idx]).attr('x'));
  if (e.clientX > parentRightBorder || e.clientX < parentLeftBorder) {
  currentProgress = e.clientX > parentRightBorder ? 100 : 0;
  if (e.clientX < parentLeftBorder) { currentAttribute = 0; }
  else {
  currentAttribute = circleContainerBarWidth(d, -magnifyIncrease) + 1;
  }
  xValue = currentAttribute;
  return currentAttribute;
  }
  const pt = d3.select('#' + treemapId).select('svg').node().createSVGPoint();
  pt.x = e.clientX;
  svgP = pt.matrixTransform(d3.select('#' + treemapId).select('svg').node().getScreenCTM().inverse());
  let val = currentAttribute - lastMousePosition + svgP.x;

  lastMousePosition = svgP.x;
  let barWidth = circleContainerBarWidth(d, -magnifyIncrease);
  if (val < 0) { val = 0; }
  if (val > barWidth) { val = barWidth + 1; }
  currentProgress = parseInt(val * 100 / barWidth);
  xValue = val;
  return val;
  });
  learningGoalProgressBar.filter(d => d === objectToMove)
  .attr("width", d => computeLearningGoalProgressBarWidth(d, currentProgress / 100));
  sliderText.filter(d => d === objectToMove)
  .text(currentProgress + '%')
  .attr("x", d => {
    return xValue + circleEnlargeFactor * sliderSize(d) / 2 + magnifyIncrease / 2;
  });
  sliderAcceptSvg.filter(d => d === objectToMove).attr('x', d => xValue - circleEnlargeFactor * sliderSize(d));
  sliderRejectSvg.filter(d => d === objectToMove).attr('x', d => xValue - circleEnlargeFactor * sliderSize(d));
  topicProgressText.filter(d => d === objectToMove.parent)
  .text(d => {
    let oldPro = objectToMove.data.pro;
  objectToMove.data.pro = currentProgress;
  let newVal = `${parseInt(computeProgress(d) * 100)}%`;
  objectToMove.data.pro = oldPro;
  return newVal;
  });
  topicProgressPie.filter(d => d === objectToMove.parent)
  .attr('d', d => {
    let oldPro = objectToMove.data.pro;
  objectToMove.data.pro = currentProgress;
  let angle = 2 * Math.PI * computeProgress(d);
  objectToMove.data.pro = oldPro;
  if (angle === 2 * Math.PI) { return `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 `; }
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  return `M 50 50 v -49 A 49,49 0 ${angle >= Math.PI ? 1 : 0},1 ${sin * 49 + 50} ${-cos * 49 + 50} L 50 50 z`;
  });

  }
  /**
  * Starts moving the slider with the mouse
  * @param {event} e Mouse down event
  * @param {object} d Clicked element
  */
  function startChangingProgress(e, d) {
  if (!isZoomedIn) { return; }
  if (highlightedGoals && highlightedGoals.includes(d)) { unhighlightLearningGoals(); }
  if (confirmationBoxesActive && confirmationDialogShown && d !== objectToMove) {
  return shakeConfirmationDialog();
  }
  const pt = d3.select('#' + treemapId).select('svg').node().createSVGPoint();
  pt.x = e.clientX;
  const svgP = pt.matrixTransform(d3.select('#' + treemapId).select('svg').node().getScreenCTM().inverse());
  objectToMove = d;
  currentProgress = d.data.pro;
  changingProgress = true;
  lastMousePosition = svgP.x;
  svg.on('mousemove', e => performChanges(e))
  .on('mouseup', stopChangingProgress);
  }
  /**
  * Stops moving the slider with the mouse, toggles the confirmation dialogs
  */
  function stopChangingProgress() {
  if (!isZoomedIn || !changingProgress) { return; }
  changingProgress = false;
  if (Math.abs(currentProgress - objectToMove.data.pro) < 0.01) {
  return;
  }
  svg.on('mousemove', null)
  .on('mouseup', null);
  if (confirmationBoxesActive) {
  confirmationDialogShown = true;
  toggleConfirmationDialog();
  } else {
    acceptChanges();
  }
  }

  let finalizingChanges = false;
  /**
  * Toggles the confimation dialogs
  */
  function toggleConfirmationDialog() {
  finalizingChanges = true;
  let t = d3.transition().duration(400).ease(d3.easeBack);

  sliderRejectCircle.filter(d => d === objectToMove).transition(t)
  .attr('visibility', 'display')
  .attr('cy', d => (circleEnlargeFactor * sliderSize(d)) / 2)
  .attr('cx', d => (circleEnlargeFactor) * sliderSize(d));
  sliderRejectIcon.filter(d => d === objectToMove).transition(t)
  .attr('visibility', 'display')
  .attr('y', d => (circleEnlargeFactor * sliderSize(d)) / 2 - sliderCircleIconSize / 2)
  .attr('x', d => (circleEnlargeFactor) * sliderSize(d) - sliderCircleIconSize / 2);
  sliderAcceptCircle.filter(d => d === objectToMove).transition(t)
  .attr('visibility', 'display')
  .attr('cy', d => (circleEnlargeFactor * sliderSize(d)) / 2)
  .attr('cx', d => (2 * circleEnlargeFactor) * sliderSize(d) + magnifyIncrease);
  sliderAcceptIcon.filter(d => d === objectToMove).transition(t)
  .attr('visibility', 'display')
  .attr('x', d => (2 * circleEnlargeFactor) * sliderSize(d) + magnifyIncrease - sliderCircleIconSize / 2)
  .attr('y', d => (circleEnlargeFactor * sliderSize(d)) / 2 - sliderCircleIconSize / 2);
  }

  /**
  * Saves the progress changes
  */
  function acceptChanges() {
  objectToMove.data.pro = currentProgress;
  if (updateProgressCallback !== null) {
  updateProgressCallback(this, objectToMove, currentProgress);
  }

  let t = d3.transition().duration(200).ease(d3.easeBack);
  t.end()
  .then(() => {
    sliderAcceptCircle.attr('visibility', 'hidden');
  sliderAcceptIcon.attr('visibility', 'hidden');
  sliderRejectCircle.attr('visibility', 'hidden');
  sliderRejectIcon.attr('visibility', 'hidden');
  });
  resetSlider((d) => d === objectToMove, t, false);
  confirmationDialogShown = false;
  reduceSlider(objectToMove);
  setTimeout(() => {
    xTouchStart = -1;
  currentProgress = null;
  finalizingChanges = false;
  }, 500);
  }
  /**
  * Rejects the progress changes and restore previous state
  */
  function rejectChanges() {
  let t = d3.transition().duration(200).ease(d3.easeLinear);
  t.end().then(() => {
    sliderAcceptCircle.attr('visibility', 'hidden');
  sliderAcceptIcon.attr('visibility', 'hidden');
  sliderRejectCircle.attr('visibility', 'hidden');
  sliderRejectIcon.attr('visibility', 'hidden');
  });
  sliderSvg.filter(d => d === objectToMove).transition(t)
  .attr("x", d => computeCircleContainerXPosition(d));
  learningGoalProgressBar.filter(d => d === objectToMove).transition(t)
  .attr('width', d => computeLearningGoalProgressBarWidth(d));
  sliderText.filter(d => d === objectToMove).transition(t)
  .text(objectToMove.data.pro + '%')
  .attr("x", d => computeCircleTextXPosition(d));
  resetSlider((d) => d === objectToMove, t, false);
  let oldPro = objectToMove.data.pro;
  objectToMove.data.pro = currentProgress;
  let currentProg = Math.round(computeProgress(objectToMove.parent) * 100) / 100;
  objectToMove.data.pro = oldPro;
  let newProg = Math.round(computeProgress(objectToMove.parent) * 100) / 100;
  let sign = currentProg > newProg ? -.01 : .01;
  changeProgressDegree(currentProg, sign, currentProg, newProg, objectToMove.parent, 200);
  confirmationDialogShown = false;
  reduceSlider(objectToMove);
  setTimeout(() => {
    xTouchStart = -1;
  finalizingChanges = false;
  }, 200);
  }

  /**
  * Changes the progress of a topic
  * @param {float} prog Progress to set
  * @param {float} sign Change in positive or negative
  * @param {float} startValue Start value of the change (used for animation)
  * @param {float} finishValue End value of the change (used for animation)
  * @param {object} el Element to apply the change to
  * @param {float} duration Duration of the animation
  */
  function changeProgressDegree(prog, sign, startValue, finishValue, el, duration) {
  let actualProg = Math.round(prog * 100) / 100;
  topicProgressText.filter(d => d === el).transition().duration(duration / (Math.abs(finishValue - startValue) * 100))
  .text(`${parseInt(actualProg * 100)}%`);
  topicProgressPie.filter(d => d === el).transition().duration(duration / (Math.abs(finishValue - startValue) * 100))
  .attr('d', () => {
    let newAngle = 2 * Math.PI * actualProg;
  if (newAngle === 2 * Math.PI) {
  return `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 z`;
  }
  let sin = Math.sin(newAngle);
  let cos = Math.cos(newAngle);
  return `M 50 50 v -49 A 49,49 0 ${newAngle >= Math.PI ? 1 : 0},1 ${sin * 49 + 50} ${-cos * 49 + 50} z`;
  })
  .end()
  .then(() => {
    if (Math.round(Math.abs(actualProg - finishValue) * 100) / 100 !== 0) {
  return changeProgressDegree(prog === null ? null : prog + sign, sign, startValue, finishValue, el, duration);
  }
  currentProgress = null;
  lastMousePosition = null;
  confirmationDialogShown = false;
  return;
  });
  }

  let isShaking = false;
  /**
  *  Shakes the confirmation dialog
  */
  function shakeConfirmationDialog() {
  if (isShaking) { return; }
  isShaking = true;
  if (!confirmationDialogShown) {
  throw 'No dialog is open, what is going on';
  }
  shake(sliderAcceptG.filter(d => d === objectToMove), 1, 4);
  shake(sliderRejectG.filter(d => d === objectToMove), -1, 4, true);
  }
  /**
  *  Shakes the confirmation dialog
  *  @param {object} element Element to shake
  *  @param {int} startValue Start value
  *  @param {int} recursion Number of times to repeat shaking
  *  @param {bool} stopShaking Whether to stop shaking at the end
  */
  function shake(element, startValue, recursion, stopShaking = false) {
  let t = d3.transition().duration(50);

  if (!recursion && stopShaking) {
  return element.transition(t)
  .attr('transform', '').end().then(() => { isShaking = false; });
  }
  if (!recursion) {
  return element.transition(t).attr('transform', '');
  }
  return element.transition(t)
  .attr('transform', `translate(${startValue * 1},0)`)
  .end().then(() => shake(element, startValue * -1, recursion - 1, stopShaking));
  }

  /**
  *  Resizes the slider on hover
  *  @param {event} e Mouseenter or mouseleave event
  *  @param {object} p Element to resize
  */
  function resizeSlider(e, p) {
  if (!isZoomedIn || confirmationDialogShown || changingProgress || finalizingChanges || zooming) {
  return;
  }
  let increasing = e.type === 'mouseenter';
  let posDiff = 0;
  sliderSvg.filter(d => d === p).transition().duration(300)
  .attr('x', d => {
    let rectWidthVal = rectWidth(d.target);
  if (increasing) {
  let newVal = computeCircleContainerXPosition(d) - magnifyIncrease / 2;
  let endVal = newVal + circleEnlargeFactor * sliderSize(d) + magnifyIncrease;
  if (newVal < 0) {
  posDiff = newVal;
  newVal = 0;
  }
  else if (endVal > rectWidthVal) {
    posDiff = endVal - rectWidthVal - 1;
  newVal -= posDiff;
  }
  return newVal;
  }
  let position = computeCircleContainerXPosition(d);
  return d.data.pro === 100 ? position + 1 : position;
  })
  .attr('y', d => increasing ? computeCircleContainerYPosition(d, true, magnifyIncrease) :
    computeCircleContainerYPosition(d, true))
  .attr('width', d => increasing ? circleEnlargeFactor * sliderSize(d) + magnifyIncrease :
    circleEnlargeFactor * sliderSize(d))
  .attr('height', d => increasing ? circleEnlargeFactor * sliderSize(d) + magnifyIncrease :
    circleEnlargeFactor * sliderSize(d));
  sliderText.filter(d => d === p).transition().duration(300)
  .attr('x', (d, idx, nodes) => increasing ?
    parseFloat(d3.select(nodes[idx]).attr('x')) - posDiff :
  computeCircleTextXPosition(d));
  }
  /**
  *  Reduces size of slider after changes are accepted/rejected
  *  @param {object} p Element to resize
  */
  function reduceSlider(p) {
  if (!isZoomedIn) { return; }
  if (confirmationDialogShown) { return shakeConfirmationDialog(); }
  sliderSvg.filter(d => d === p).transition().duration(300)
  .attr('x', d => computeCircleContainerXPosition(d))
  .attr('y', d => computeCircleContainerYPosition(d, true))
  .attr('width', d => circleEnlargeFactor * sliderSize(d))
  .attr('height', d => circleEnlargeFactor * sliderSize(d));
  sliderText.filter(d => d === p).transition().duration(300)
  .attr("x", d => computeCircleTextXPosition(d));

  }

  /**
  *  Moves the svg of the progress of the topic
  *  @param {object} t Transition to apply
  */
  function moveTopicProgress(t) {
  topicProgressG.transition(t)
  .attr('transform', d => {
    let tempWidth = rectWidth(d.target);
  let tempHeight = rectHeight(d.target);
  if (isZoomedIn && !isSmallScreen) {
  return `translate(${tempWidth - mainCircleWidth - topicCellPadding}, ${tempHeight / 2 - mainCircleRadius})`;
  }
  if (isZoomedIn && isSmallScreen) {
  return `translate(${rectWidth(d) - mainCircleWidth - topicCellPadding}, ${rectHeight(d) / 2 - mainCircleRadius})`;
  }
  if (!isZoomedIn && isSmallScreen) {
  return `translate(${(width - lastY) / 2 + lastY - topicProgressSizeFactor() * mainCircleWidth / 2},
${(height) / 2 - topicProgressSizeFactor() * mainCircleRadius})`;
  }
  return `translate(${tempWidth / 2 - (topicProgressSizeFactor() + 1) * mainCircleRadius},
${tempHeight - topicProgressSizeFactor() * 4 * mainCircleRadius})`;
  });
  topicProgressContainerBG.transition(t)
  .attr('x', isSmallScreen || isZoomedIn ? 0 : mainCircleRadius)
  .attr('width', isZoomedIn ? mainCircleWidth : topicProgressSizeFactor() * mainCircleWidth)
  .attr('height', isZoomedIn ? mainCircleWidth : topicProgressSizeFactor() * mainCircleWidth);
  topicProgressContainer.transition(t)
  .attr('x', isSmallScreen || isZoomedIn ? 0 : mainCircleRadius)
  .attr('width', isZoomedIn ? mainCircleWidth : topicProgressSizeFactor() * mainCircleWidth)
  .attr('height', isZoomedIn ? mainCircleWidth : topicProgressSizeFactor() * mainCircleWidth);
  topicProgressTextSvg.transition(t)
  .attr('width', isZoomedIn ? subCircleWidth : topicProgressSizeFactor() * subCircleWidth)
  .attr('height', isZoomedIn ? subCircleWidth : topicProgressSizeFactor() * subCircleWidth)
  .attr('x', () => {
    if (isZoomedIn) { return (mainCircleRadius - subCircleRadius); }
  if (!isZoomedIn && isSmallScreen) {
  return topicProgressSizeFactor() * (mainCircleRadius - subCircleRadius);
  }
  return topicProgressSizeFactor() * (mainCircleRadius - subCircleRadius) + mainCircleRadius;
  })
  .attr('y', isZoomedIn ?
    (mainCircleRadius - subCircleRadius) :
  topicProgressSizeFactor() * (mainCircleRadius - subCircleRadius));
  topicProgressText.transition(t)
  .style("font", `${(!isZoomedIn ? topicProgressSizeFactor() : 1) * subCircleWidth / 2.7}px sans-serif`)
  .attr('y', isZoomedIn ? mainCircleRadius : topicProgressSizeFactor() * mainCircleRadius)
  .attr('x', () => {
    if (isZoomedIn) { return mainCircleRadius; }
  if (!isZoomedIn && isSmallScreen) { return topicProgressSizeFactor() * mainCircleRadius; }
  return (1 + topicProgressSizeFactor()) * mainCircleRadius;
  });
  }
  /**
  *  Computes the x position of the text containing the progress on the slider
  *  @param {object} d Element to use
  *  @returns {float} X position
  */
  function computeCircleTextXPosition(d) {
  return computeCircleContainerXPosition(d) + circleEnlargeFactor * sliderSize(d) / 2;
  }
  /**
  *  Computes the width of the progress slider container
  *  @param {object} d Element to use
  *  @param {float} extraFactor Additional factor to add to size of element
  *  @returns {float} Width
  */
  function circleContainerBarWidth(d, extraFactor = 0) {
  if (isSmallScreen && !hasTouchscreen) {
  return (rectWidth(d.target) - circleEnlargeFactor * sliderSize(d) + extraFactor);
  }
  if (isSmallScreen) {
  return (rectWidth(d.target) - circleEnlargeFactor * sliderSize(d) + extraFactor);
  }
  return (rectWidth(d) - circleEnlargeFactor * sliderSize(d) + extraFactor);

  }
  /**
  *  Computes the y position of the circle of the slider that holds the progress
  *  @param {object} d Element to use
  *  @param {float} extraFactor Additional factor to add to size of element
  *  @returns {float} Y position
  */
  function computeCircleContainerXPosition(d, extraFactor = 1) {
  return circleContainerBarWidth(d, extraFactor) * d.data.pro / 100;
  }
  /**
  *  Computes the x position of the circle of the slider that holds the progress
  *  @param {object} d Element to use
  *  @param {bool} useTarget Whether to use the target property or not
  *  @param {float} extraValue Additional factor to subtract from the position
  *  @returns {float} y position
  */
  function computeCircleContainerYPosition(d, useTarget = false, extraValue = 0) {
  return rectHeight(useTarget ? d.target : d) - circleEnlargeFactor * sliderSize(d) - extraValue;
  }
  /**
  *  Computes the width of the progress bar of a learning goal
  *  @param {object} d Element to use
  *  @param {float} progress Current progress
  *  @returns {float} Width
  */
  function computeLearningGoalProgressBarWidth(d, progress = null) {
  if (progress === null) { progress = d.data.pro / 100; }
  if (progress >= .9) {
  return rectWidth(hasTouchscreen && xTouchStart === -1 ? d : d.target) * (progress - 0.05);
  }
  if (progress < 0.05 && progress > 0) {
  return rectWidth(hasTouchscreen && xTouchStart === -1 ? d : d.target) * (progress + 0.05);
  }
  return rectWidth(hasTouchscreen && xTouchStart === -1 ? d : d.target) * progress;
  }

  /**
  *  Computes the size of the slider
  *  @param {object} d Element to use
  *  @returns {float} Size
  */
  function sliderSize(d) {
  if (isSmallScreen) {
  return Math.min(d.proY1 - d.proY0, 40);
  }
  return Math.min(d.proY1 - d.proY0, 56);
  }

  /**
  *  Computes the size factor of the topic progress
  *  @returns {float} Size
  */
  function topicProgressSizeFactor() {
  if (!isZoomedIn && isSmallScreen) {
  return (width - lastY) * 1.5 / ((2 * mainCircleWidth > 100 ? 100 / (mainCircleWidth) : 2) * mainCircleWidth);
  }
  return 2 * mainCircleWidth > 100 ? 100 / (mainCircleWidth) : 2;
  }

  /**
  *  Changes the size of the slider svg
  *  @param {object} element Element to change
  *  @param {bool} smallVersion Whether to use the small version or not
  *  @returns {object} For chaining
  */
  function changeSliderSvg(element, smallVersion) {
  return element
  .attr('width', d => smallVersion ? sliderSize(d) : 3 * circleEnlargeFactor * sliderSize(d))
  .attr('height', d => smallVersion ? sliderSize(d) : circleEnlargeFactor * sliderSize(d))
  .attr('x', d => {
    if (smallVersion) { return d.proY0; }
  return computeCircleContainerXPosition(d) - circleEnlargeFactor * sliderSize(d);
  })
  .attr('y', d => smallVersion ?
    (rectHeight(d) - sliderSize(d)) / 2 :
  rectHeight(d.target) - circleEnlargeFactor * sliderSize(d));
  }

  /**
  *  Changes the position of the slider circles
  *  @param {object} element Element to change
  *  @param {bool} smallVersion Whether to use the small version or not
  *  @returns {object} For chaining
  */
  function changeSliderCircles(element, smallVersion) {
  return element
  .attr('cx', d => smallVersion ? sliderCircleIconSize / 2 : 3 * circleEnlargeFactor * sliderSize(d) / 2)
  .attr('cy', d => smallVersion ? sliderCircleIconSize / 2 : (circleEnlargeFactor - .5) * sliderSize(d));
  }

  /**
  *  Changes the position of the slider circle icons
  *  @param {object} element Element to change
  *  @param {bool} smallVersion Whether to use the small version or not
  *  @returns {object} For chaining
  */
  function changeSliderCircleIcon(element, smallVersion) {
  return element
  .attr('x', d => smallVersion ? 0 : (3 * circleEnlargeFactor * sliderSize(d) - sliderCircleIconSize) / 2)
  .attr('y', d => smallVersion ? 0 : (circleEnlargeFactor - .5) * sliderSize(d) - sliderCircleIconSize / 2);
  }

  /**
  *  Reset the slider to its initial position and size
  *  @param {function} compFunc Filter function
  *  @param {object} trans Transition to apply
  *  @param {bool} smallVersion Whether to use the small version or not
  */
  function resetSlider(compFunc, trans, smallVersion) {
  changeSliderSvg(sliderAcceptSvg.filter(d => compFunc(d)).transition(trans), smallVersion);
  changeSliderSvg(sliderRejectSvg.filter(d => compFunc(d)).transition(trans), smallVersion);
  changeSliderCircles(sliderAcceptCircle.filter(d => compFunc(d)).transition(trans), smallVersion);
  changeSliderCircles(sliderRejectCircle.filter(d => compFunc(d)).transition(trans), smallVersion);
  changeSliderCircleIcon(sliderAcceptIcon.filter(d => compFunc(d)).transition(trans), smallVersion);
  changeSliderCircleIcon(sliderRejectIcon.filter(d => compFunc(d)).transition(trans), smallVersion);
  }

  /**
  *  Setup of slider svg
  *  @param {object} parentElement Parent element
  *  @param {string} label Aria label
  *  @param {function} func Function to apply on click
  *  @returns {object} For chaining
  */
  function setupSliderSvg(parentElement, label, func) {
  return changeSliderSvg(parentElement.append('svg'), true)
  .attr('aria-label', label)
  .attr('cursor', 'pointer')
  .attr('fill', d => color(d.parent.data.name))
  .on('click', func);
  }

  /**
  *  Setup of slider circle
  *  @param {object} parentElement Parent element
  *  @returns {object} For chaining
  */
  function setupSliderCircles(parentElement) {
  return changeSliderCircles(parentElement.append('circle'), true)
  .attr('r', sliderCircleRadius)
  .attr('visibility', 'hidden');
  }

  /**
  *  Setup of slider circle icon
  *  @param {object} parentElement Parent element
  *  @param {string} path of the icon
  *  @returns {object} For chaining
  */
  function setupSliderCircleIcon(parentElement, path) {
  let el = changeSliderCircleIcon(parentElement.append('svg'), true)
  .attr('viewBox', `0 0 ${circlesViewBox} ${circlesViewBox}`)
  .attr('width', sliderCircleIconSize)
  .attr('height', sliderCircleIconSize)
  .attr('fill', 'none')
  .attr('stroke', d => contrastCorrectedColor(d, 1, false))
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-width', 4)
  .attr('visibility', 'hidden');
  el.append('path')
  .attr('d', path === 'reject' ? rejectPath : acceptPath);
  return el;
  }

  let isAccessibilityDialogShown = false;

  /**
  *  Toggles the accessibility dialog
  */
  function toggleAccessibilityDialog() {
  if (!isSmallScreen && !isAccessibilityDialogShown) {
  accessibilityBG.transition('blur-' + treemapId).duration(100).attr('fill', '#fefefe')
  .end().then(() => accessibilityBG.transition().duration(100).attr('fill', `url(#gradient-${treemapId})`));
  }
  else if (!isSmallScreen) {
    accessibilityCloseBG.transition('blur2-' + treemapId).duration(100).attr('fill', '#fefefe')
  .end().then(() => accessibilityCloseBG.transition().duration(100).attr('fill', `url(#gradient-${treemapId})`));
  }
  accessibilityIconG.transition('transform-' + treemapId).duration(700).ease(d3.easePolyInOut.exponent(4))
  .style('transform', isAccessibilityDialogShown ? 'translate(0,0)' : `translate(0, -200px)`);

  if (!isAccessibilityDialogShown) {
  blurDiv.style('z-index', 50);
  }
  blurDiv.transition('changeTop-' + treemapId).duration(700).ease(d3.easePolyInOut.exponent(4))
  .style('top', `${isAccessibilityDialogShown ? -accessibilityDialogSVGHeight - 2 * colorPaletteBgRadius : 0}%`)
  .end().then(() => {
    if (!isAccessibilityDialogShown) {
  blurDiv.style('z-index', -1);
  }
  });
  isAccessibilityDialogShown = !isAccessibilityDialogShown;
  }

  /**
  *  Computes the size of the text of the slider
  *  @param {object} el Element where the text lies
  *  @param {bool} smallVersion Whether to use the small version or not
  *  @returns {float} Size
  */
  function sliderTextSize(el, smallVersion) {
  if (!smallVersion) {
  return circleEnlargeFactor * sliderSize(el) / 3.5;
  }
  let val = sliderTextShowPercent(el) ? sliderTextMaxFontSize : (el.proX1 - el.proX0) * fontFactor;
  let elSize = sliderSize(el);
  if (val > elSize) { val = elSize / 2; }
  return val;
  }
  /**
  *  Returns whether to show the percent symbol
  *  @param {object} el Element
  *  @returns {bool} Show % or not
  */
  function sliderTextShowPercent(el) {
  return !isSmallScreen && sliderTextMaxFontSize < (el.proX1 - el.proX0) * fontFactor;
  }
  /**
  *  Checks if the percent fits inside slider
  *  @returns {bool} Show or not
  */
  function checkSliderPercentFits() {
  let textFits = true;
  sliderText.each((_, i, n) => {
    if (n[i].getBoundingClientRect().width >=
    n[i].parentNode.getElementsByClassName('slider')[0].getBoundingClientRect().width) {
  textFits = false;
  }
  });
  return textFits;
  }
  /**
  *  Computes the height of the learning goal progress bar
  *  @param {object} d Element
  *  @returns {float} Height
  */
  function learningGoalProgressBarHeight(d) {
  if (isZoomedIn) { return rectHeight(d.target); }
  if (isSmallScreen && isLandscapeMode) {
  return Math.min(rectHeight(d.target), 12) * 0.8;
  }
  if (isSmallScreen) {
  return Math.min(rectHeight(d.target), 12);
  }
  return Math.min(rectHeight(d), 14);
  }
  /**
  *  Computes the font size for an element
  *  @param {object} el Element
  *  @returns {float} Size
  */
  function fontSize(el) {
  if (isSmallScreen) {
  if (isZoomedIn && el.depth === 0) {
  return Math.min(rectHeight(el.children[0].target) / 6, 17.0185) + currentTextZoom;
  }
  if (isZoomedIn && el.depth === 1) {
  return Math.min(rectHeight(el.target) / 6, 17.0185) + currentTextZoom + 5;
  }
  if (isZoomedIn) {
  return Math.min(rectHeight(el.target) - .5, 12.6302) + currentTextZoom + 3;
  }
  if (el.depth === 0) {
  return rectWidth(el.target ?? el) / 2 + currentTextZoom + 5;
  }
  if (el.depth === 1) {
  return Math.min(rectHeight(el.target ?? el) / 6, 17.0185) + currentTextZoom + 5;
  }
  return Math.min(rectHeight(el.target ?? el) - .5, 12.6302) + currentTextZoom + 3;
  }

  if (isZoomedIn && el.depth === 0) {
  return Math.min(rectHeight(el.children[0].target) / 6, 20.0185) + currentTextZoom;
  }
  if (isZoomedIn && el.depth === 1) {
  return Math.min(rectHeight(el.target) / 6, 25.0185) + currentTextZoom;
  }
  if (isZoomedIn) {
  return Math.min(rectHeight(el.target) - .5, 20.6302) + currentTextZoom + 5;
  }
  if (el.depth === 0) {
  return rectWidth(el) / 2 + currentTextZoom;
  }
  if (el.depth === 1) {
  return Math.min(rectHeight(el) / 6, 20.0185) + currentTextZoom;
  }
  return Math.min(rectHeight(el) - .5, 11.6302) + currentTextZoom + 5;
  }
  /**
  *  Toggles the zoom cursor between zoom out and in
  */
  function toggleZoomCursor() {
  let newCursor = isZoomedIn ? 'zoom-out' : 'zoom-in';
  topicProgressG.attr('cursor', newCursor);
  learningGoalProgressBar.attr('cursor', newCursor);
  rect.filter(d => d.depth > 0).attr('cursor', newCursor);
  }

  /**
  *  Updates the text formatting (wraps or truncate text)
  */
  function updateTextFormatting() {
  maintspan.style("font", d => `${fontSize(d)}px sans-serif`);
  if (isZoomedIn && isSmallScreen) {
  maintspan.filter(d => d.depth === 2)
  .call(wrapText,
  (rectWidth(depth2Child.target) - 2 * topicCellPadding),
  false,
  (el) => {
  return computeCircleContainerYPosition(el, true) +
    circleEnlargeFactor * sliderSize(el) / 4;
  },
  topicCellPadding);

  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  (depth1Width - 2 * topicCellPadding),
  false,
  (el) => {
  return rectHeight(el.target) -
    4 * topicProgressSizeFactor() * mainCircleRadius;
  },
  topicCellPadding);

  }
  else if (isZoomedIn) {
    maintspan.filter(d => d.depth === 2)
  .call(
  wrapText,
  (depth2Width - 2 * topicCellPadding),
  false,
  () => {
  return computeCircleContainerYPosition(depth2Child, true) + circleEnlargeFactor * sliderSize(depth2Child) / 4;
  },
  topicCellPadding);
  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  (depth1Width - 2 * topicCellPadding),
  false,
  (el) => {
  return rectHeight(el.target) -
    4 * topicProgressSizeFactor() * mainCircleRadius;
  },
  topicCellPadding);
  }
  else {
  maintspan.filter(d => d.depth === 1)
  .call(
  wrapText,
  depth1Width - mainCircleWidth - 3 * topicCellPadding,
  false,
  (el) => rectHeight(el),
  topicCellPadding);
  maintspan.filter(d => d.depth === 2)
  .call(truncateText, depth2Width * 0.95, true);
  }
  maintspan.filter(d => d.depth === 0).text(widgetTitle);
  text.filter(d => d.depth === 0)
  .style('letter-spacing', '1em');
  if (rootText.getBBox().height >= rootNode.querySelector('.rect').getBBox().height) {
  text.filter(d => d.depth === 0)
  .style('letter-spacing', '0.3em');
  if (rootText.getBBox().height >= rootNode.querySelector('.rect').getBBox().height) {
  truncateTitle(rootText, rootNode, maintspan.filter(d => d.depth === 0));
  }

  }
  }

  /**
  *  Zooms in the text
  */
  function zoomInText() {
  currentTextZoom += zoomDelta;
  if (!isSmallScreen) {
  zoomRightHalf.transition().duration(100).attr('fill', '#fefefe')
  .end().then(() => zoomRightHalf.transition().duration(100).attr('fill', `url(#gradient-${treemapId})`)
    .end().then(() => updateTextFormatting()));
  } else { updateTextFormatting(); }
  }

  /**
  *  Zooms out the text
  */
  async function zoomOutText() {
  currentTextZoom -= zoomDelta;
  if (!isSmallScreen) {
  zoomLeftHalf.transition().duration(100).attr('fill', '#fefefe').end()
  .then(() => zoomLeftHalf.transition().duration(100).attr('fill', `url(#gradient-${treemapId})`));
  }
  updateTextFormatting();
  if (isZoomInDisabled) { enableZoomIn(); }
  }
  /**
  *  Sets the aria label property of the title
  */
  function setDepth1AriaLabel() {
  rect.filter(d => d.depth === 1)
  .attr('tabindex', 0)
  .attr('aria-label', d => {
    let content = `Topic ${d.data.name}. Progress ${parseInt(computeProgress(d) * 100)}%.`;
  if ('children' in d) {
  content += `${d.children.length} learning goal${d.children.length > 1 ? 's' : ''}, press enter to expand the list.
Use tab to navigate through it.`;
  }
  content += `${d.data.link ? 'External link is available, press control and enter to open it.' : ' '}`;
  return content;
  });
  }

  /**
  *  Fits the vertical topic
  */
  function fitVerticalTopic() {
  let topicNode = null;
  let topicText = null;
  addedTopic
  .each((_, i, n) => {
    topicText = n[i];
  topicNode = topicText.parentNode.parentNode;
  });
  let padding = 30;
  const currentClickedTopic = clickedTopic;
  for (let em = 0.2; em > 0; em -= 0.1) {
  if (!(topicText.getBBox().height + 2 * padding >= topicNode.querySelector('.rect').getBBox().height)) {
  return;
  }
  text.filter(d => d === currentClickedTopic)
  .style('letter-spacing', `${em}em`);
  }
  let currentSize = parseFloat(text.filter(d => d === clickedTopic)
    .style("font").split("p")[0]);
  let minWidth = 17;

  const lastCurrentSize = currentSize;
  while (currentSize > minWidth &&
    topicText.getBBox().height + 2 * padding >=
  topicNode.querySelector('.rect').getBBox().height) {
  currentSize = parseFloat(d3.select(topicText)
    .style("font").split("p")[0]);
  d3.select(topicText)
  .style("font", `${lastCurrentSize - zoomDelta}px sans-serif`);
  }
  if (topicText.getBBox().height + 2 * padding < topicNode.querySelector('.rect').getBBox().height) { return; }

  let originalText = addedTopic.html();
  while (topicText.getBBox().height + 2 * padding >= topicNode.querySelector('.rect').getBBox().height) {
  originalText = originalText.substring(0, originalText.length - 1);
  addedTopic.html(originalText + U_ELLIPSIS);
  if (originalText.length < 1) {
  return;
  }
  }
  }

  let xTouchStart = -1;
  /**
  * Starts moving the slider with the touch
  * @param {event} event Touch start event
  * @param {object} d Clicked element
  */
  function sliderTouchStart(event, d) {
  if (!isZoomedIn) { return; }
  if (confirmationBoxesActive && confirmationDialogShown && d !== objectToMove) {
  return shakeConfirmationDialog();
  }
  const pt = d3.select('#' + treemapId).select('svg').node().createSVGPoint();
  pt.x = event.touches.item(0).clientX;
  const svgP = pt.matrixTransform(d3.select('#' + treemapId).select('svg').node().getScreenCTM().inverse());
  xTouchStart = svgP.x;
  objectToMove = d;
  changingProgress = true;
  }

  /**
  * Moves the slider with the touch
  * @param {event} e Touch move event
  */
  function sliderTouchMove(e) {
  if (!isZoomedIn || !changingProgress) { return; }
  e.preventDefault();
  let svgP = null;
  let xValue = null;
  sliderSvg.filter(d => d === objectToMove).attr('x', (d, idx, nodes) => {
    let parent = nodes[idx].parentElement.parentElement;
  let parentRightBorder = parent.childNodes[0].getBoundingClientRect().right;
  let parentLeftBorder = parent.childNodes[0].getBoundingClientRect().left;
  let currentAttribute = parseFloat(d3.select(nodes[idx]).attr('x'));
  if (e.touches.item(0).clientX > parentRightBorder || e.touches.item(0).clientX < parentLeftBorder) {
  currentProgress = e.touches.item(0).clientX > parentRightBorder ? 100 : 0;
  if (e.touches.item(0).clientX < parentLeftBorder) {
  currentAttribute = 0;
  } else {
    currentAttribute = circleContainerBarWidth(d, -magnifyIncrease) + 1;
  }
  xValue = currentAttribute;
  return currentAttribute;
  }
  const pt = d3.select('#' + treemapId).select('svg').node().createSVGPoint();
  pt.x = e.touches.item(0).clientX;
  svgP = pt.matrixTransform(d3.select('#' + treemapId).select('svg').node().getScreenCTM().inverse());
  let val = currentAttribute - xTouchStart + svgP.x;

  xTouchStart = svgP.x;
  let barWidth = circleContainerBarWidth(d, -magnifyIncrease);
  if (val < 0) { val = 0; }
  if (val > barWidth) { val = barWidth + 1; }
  currentProgress = parseInt(val * 100 / barWidth);
  xValue = val;
  return val;
  });
  learningGoalProgressBar.filter(d => d === objectToMove)
  .attr("width", d => computeLearningGoalProgressBarWidth(d, currentProgress / 100));
  sliderText.filter(d => d === objectToMove)
  .text(currentProgress + '%')
  .attr("x", d => {
    return xValue + circleEnlargeFactor * sliderSize(d) / 2 + magnifyIncrease / 2;
  });
  sliderAcceptSvg.filter(d => d === objectToMove)
  .attr('x', d => xValue - circleEnlargeFactor * sliderSize(d));
  sliderRejectSvg.filter(d => d === objectToMove)
  .attr('x', d => xValue - circleEnlargeFactor * sliderSize(d));

  topicProgressText.filter(d => d === objectToMove.parent)
  .text(d => {
    let oldPro = objectToMove.data.pro;
  objectToMove.data.pro = currentProgress;
  let newVal = `${parseInt(computeProgress(d) * 100)}%`;
  objectToMove.data.pro = oldPro;
  return newVal;
  });

  topicProgressPie.filter(d => d === objectToMove.parent)
  .attr('d', d => {
    let oldPro = objectToMove.data.pro;
  objectToMove.data.pro = currentProgress;
  let angle = 2 * Math.PI * computeProgress(d);
  objectToMove.data.pro = oldPro;
  if (angle === 2 * Math.PI) {
  return `M 50 50 m 49, 0 a 49,49 0 1,0 -98,0 a 49,49 0 1,0 98,0 `;
  }
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  return `M 50 50 v -49 A 49,49 0 ${angle >= Math.PI ? 1 : 0},1 ${sin * 49 + 50} ${-cos * 49 + 50} L 50 50 z`;
  });
  }
  /**
  * Stops moving the slider with the touch
  */
  function sliderTouchEnd() {
  if (!isZoomedIn || !changingProgress) { return; }
  changingProgress = false;
  if (Math.abs(currentProgress - objectToMove.data.pro) < 0.01) {
  return;
  }
  if (confirmationBoxesActive) {
  confirmationDialogShown = true;
  toggleConfirmationDialog();
  } else {
    acceptChanges();
  }
  }
  /**
  * Searches for a depth 2 child
  * @param {object} root Root element
  * @returns {object} depth 2 child or null
  */
  function findDepth2Child(root) {
  if (!root.children || !root.children.length) { return null; }
  for (let i = 0; i < root.children.length; i++) {
  if (!root.children[i].children || !root.children[i].children.length) {
  continue;
  }
  return root.children[i].children[0];
  }
  return null;
  }
  /**
  * Computes the number of elements in the treemap
  * @param {object} data Data
  * @returns {object} number of topics and the highest number of children a topic has
  */
  function getNumberOfElements(data) {
  const numberOfTopics = data.children.length ?? 0;
  let highestNumberChildren = 0;
  if (numberOfTopics === 0) {
  return { numberOfTopics, highestNumberChildren };
  }
  data.children.forEach((child) => {
    if (child.children.length > highestNumberChildren) {
  highestNumberChildren = child.children.length;
  }
  });
  highestNumberChildren += 1;
  return { numberOfTopics, highestNumberChildren };
  }
  }
/**
* Extracts the goals to highlight
* @param {object} rawGoals Raw goals
* @returns {object} Goals to highlight
*/
function extractToHighlightGoals(rawGoals) {
  let root = d3.select('#root-rect' + treemapId).data()[0];
  let goals = [];
  rawGoals.forEach(element => {
    for (let i = 0; i < root.children.length; i++) {
  if (root.children[i].data.name !== element.topic) { continue; }
  for (let j = 0; j < root.children[i].children.length; j++) {
  if (root.children[i].children[j].data.name !== element.goal) { continue; }
  goals.push(root.children[i].children[j]);
  return;
  }
  }
  });
  return goals;
  }
/**
* Highlights the goals
* @param {object} goals Goals
*/
/* eslint-disable-next-line no-unused-vars */
const highlightLearningGoals = (goals) => {
  // Change border
highlightedGoals = extractToHighlightGoals(goals);
let savedColorschemes = JSON.parse(localStorage.getItem(colorschemeStorageName));
d3.select('#' + treemapId).selectAll('.rect').filter(d => highlightedGoals.includes(d))
.attr('class', "rect " + savedColorschemes[treemapId] !== "grayscaleLight" ? 'highlight-rect' : 'highlight-rect-dark');
d3.select('#' + treemapId).selectAll('.prog-bar').filter(d => highlightedGoals.includes(d))
.attr('class', `prog-bar ${'highlight-bar'}`);
setTimeout(() => {
  if (highlightedGoals) {
unhighlightLearningGoals();
}
}, 1000 * HIGHLIGHT_DURATION_SEC);
};
/**
* Remove highlight from the goals
*/
function unhighlightLearningGoals() {
  d3.select('#' + treemapId).selectAll('.rect').filter(d => highlightedGoals.includes(d))
  .attr('class', 'rect');
  d3.select('#' + treemapId).selectAll('.prog-bar').filter(d => highlightedGoals.includes(d))
  .attr('class', 'prog-bar');
  highlightedGoals = null;
  }

/**
* Setup the svg
*/
export async function setupSvg() {
  await getSvgNode();
  let addedSvgs = d3.select('#' + treemapId).selectAll('.mainSvg');
  for (let i = 0; i < addedSvgs._groups[0].length - 1; i++) {
  d3.select('#' + treemapId).select('.mainSvg').remove();
  }
  let addedDivs = d3.select('#' + treemapId).selectAll('.mainDiv');
  for (let i = 0; i < addedDivs._groups[0].length - 1; i++) {
  d3.select('#' + treemapId).select('.mainDiv').remove();
  }
  }

//
/**
* Setup the treemap.
* @param {obj} taxonomyObj Taxonomy
* @param {obj} d3v7 d3v7
* @param {string} id Id of the treemap
* @param {string} accessibilityText Accessibility Text
* @param {bool} showConfirmation If true the user will be asked to accept
* or decline each progress change. If false then moving the slider will automatically set the progress
* @param {function} callback Callback
*/
export const setupTreemap = (taxonomyObj,
  d3v7,
id = 'treemap-1',
accessibilityText = 'No text found',
showConfirmation,
callback) => {
// Test highlight
//document.addEventListener('keydown', e => {
//  if(e.key !== 'C')
//  return;
//  let goals = [
//    {
//      "topic": "fsdfadf",
//      "goal": "afdsfadf"
//    },
//    {
//      "topic": "fsdfadf",
//      "goal": "fadfadf"
//    }
//  ];
//  !highlightedGoals? highlightLearningGoals(goals) : unhighlightLearningGoals();
//});
d3 = d3v7;
data = taxonomyObj;
taxonomy = taxonomyObj;
treemapId = id;
treemapAccessibilityText = accessibilityText;
confirmationBoxesActive = showConfirmation;
updateProgressCallback = callback;
window.onresize = setupSvg;
};
//Utils
/**
* Computes the contrast ration between two luminances
* @param {float} lum1 Luminance 1
* @param {float} lum2 Luminance 2
* @returns {float} contrast ratio
*/
function computeContrastRatio(lum1, lum2) {
  return (lum1 + 0.05) / (lum2 + 0.05);
  }
/**
* Computes the luminance of a color
* @param {array} rgb list [R, G, B]
* @returns {float} luminance
*/
function computeLuminance(rgb) {
  let sRGB = [0, 0, 0];
  rgb.forEach((color, index) => {
    let temp = color / 255;
  sRGB[index] = temp <= 0.03928 ? temp / 12.92 : ((temp + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }
/**
* Converts a rgba color to rgb, meaning how it looks on the screen
* @param {array} rgba list [R, G, B]
* @param {*} bg background color
* @param {float} alpha Alpha of the color
* @param {bool} returnString whether to return color as array or string
* @returns {*} array or string in rgb
*/
function convertRGBAtoRGB(rgba, bg, alpha, returnString = false) {
  let savedRGBA = rgba;
  if (typeof bg === 'string' && (bg.includes('rgb') || bg.includes('#'))) {
  bg = parseRGB(bg);
  }
  else if (typeof bg === 'string' && bg.localeCompare('black') === 0) {
    bg = [0, 0, 0];
  }
  else if (typeof bg === 'string' && bg.localeCompare('white') === 0) {
    bg = [255, 255, 255];
  }

  if (rgba.includes('rgb') || rgba.includes('#')) {
  let rgbaArray = parseRGB(rgba);
  rgba = rgbaArray.slice(0, 3);
  if (rgbaArray.length === 4) { alpha = rgbaArray[3]; }
  }

  if (alpha === undefined) {
  throw "Alpha is undefined for color " + savedRGBA;
  }

  let rgb = [0, 0, 0];
  rgba.forEach((color, index) => { rgb[index] = (1 - alpha) * bg[index] + alpha * color; });
  return returnString ? convertRGBArrayToString(rgb) : rgb;
  }
/**
* Converts a rgb string to array
* @param {*} element Color
* @returns {array} array rgb
*/
function parseRGB(element) {
  let rgb = [0, 0, 0];
  if (element.indexOf('#') !== -1) {
  //If it has 6 characters then each channel has 2 chars, if length is 3 then
  //char need to be repeated
  let channelLength = (element.length - 1) / 3;
  let channelFactor = channelLength === 2 ? 1 : 2;
  rgb[0] = parseInt(element.slice(1, channelLength + 1).repeat(channelFactor), 16);
  rgb[1] = parseInt(element.slice(channelLength + 1, 2 * channelLength + 1).repeat(channelFactor), 16);
  rgb[2] = parseInt(element.slice(2 * channelLength + 1, 3 * channelLength + 1).repeat(channelFactor), 16);
  return rgb;
  }
  return element.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
  }
/**
* Converts a rgb array to string
* @param {array} colorArray Color array
* @returns {string} rgb string
*/
function convertRGBArrayToString(colorArray) {
  let str = colorArray.length === 3 ? 'rgb(' : 'rgba(';
  colorArray.forEach((color, index) => {
    str += index === 3 ? parseFloat(color) : parseInt(color);
  if (index !== colorArray.length - 1) {
  str += ", ";
  }
  });
  return str + ')';
  }

/**
* Computes the width of a rect element
* @param {object} d Element
* @returns {float} Width
*/
function rectWidth(d) {
  return d ? d.y1 - d.y0 - Math.min(1, (d.y1 - d.y0) / 2) : null;
  }
/**
* Computes the height of a rect element
* @param {object} d Element
* @returns {float} Height
*/
function rectHeight(d) {
  return d ? d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2) : null;
  }

/**
* Checks if the current device has a touchscreen
* @returns {bool} whether it has touchscreen or not
*/
function detectTouchscreen() {
  let hasTouchScreen = false;
  if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator['msMaxTouchPoints'] > 0;
  } else {
    let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
  if (mQ && mQ.media === "(pointer:coarse)") {
  hasTouchScreen = !!mQ.matches;
  } else if ('orientation' in window) {
    hasTouchScreen = true; // deprecated, but good fallback
  }
  }
  return hasTouchScreen;
  }
//Node
//  module.exports = {
//    setupTreemap : setupTreemap,
//    setupSvg : setupSvg,
//  }
// Moodle
