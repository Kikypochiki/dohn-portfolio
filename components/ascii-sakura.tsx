"use client";

import { useEffect, useRef } from "react";

const TREE_MASK = String.raw`
                                                    
                  .                                 
                  ...       .                       
                  ...      ...                      
                 ....   . ..                        
                 ............   .  ..               
             ...  ...........   .. ...              
             ...............  .......               
              ......................                
      ..    .  .....................    ..          
      ....... ..................... .... .          
        .................................           
       .. ...............................           
         . ......... +  .+............              
           .............................            
          ........#........................ .       
   . ..  .............................  .. .        
   ...... ............+.......+.........            
    ............... .......... .........            
    . ................... ..... .......     . ...   
      ....................#......  . .. ........    
   .......#..........# ..#. .  ........ ........    
   ............#.....##### .............. .....     
    ........#..#.....+###.#..................       
  ...........+## . . ## ...................   ..    
  ............ ##   +## .................. .....    
   ........ ... ###### .........................    
  ... ..  ..... ###### .......................... . 
  ........#.+. ###   #####.+#.............+.......  
      .......####   . ##.#.........+#....... ....   
     ........ ###  ................. +......  .     
     ....  .  +## ................... +.......      
    ..  ..    ### .... .... .#.#+..............     
   ....        ##+ ..++###  #+.........  .......    
   ..          ##+  .#######+ ........    .    .    
             #####+ ##+   +#   ..........           
            ###########... +#  ............          
           #####++##+  ##.. ##++...........          
          +###+        .#.... ## ............        
          ####        ....+..  + ............. .     
        #####+        ... ...   #...............     
        ######            ...   ....+....++......    
         #####+                 ....  ......   .     
          +######                . .. ....           
           ########           ..  ... ... ..         
           +########              ....  ....         
            +#######               ....   . ..       
              ######        ..      ...     ..       
  .           #######                ..             
   #+         ######+                               
  +###     ++#######                                
   #### +##########+                                
    +##############                                 
    ++#############+                                
    ##+++#############                              
     #++++#############                             
     ++  ++#############                            
     +##+  +############+                           
`.split("\n").slice(1, -1).map((line) => line.padEnd(52, " "));

const GRID_WIDTH = 52;
const GRID_HEIGHT = TREE_MASK.length;
const BLOSSOM_POINTS = TREE_MASK.flatMap((line, y) =>
  [...line].flatMap((character, x) => character === "." && y < 44 ? [{ x, y }] : []),
);

type Leaf = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  phase: number;
  windResponse: number;
};

function noise(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function AsciiSakura() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const treeCanvasRef = useRef<HTMLCanvasElement>(null);
  const leafCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rootNode = rootRef.current;
    const treeCanvasNode = treeCanvasRef.current;
    const leafCanvasNode = leafCanvasRef.current;
    if (!rootNode || !treeCanvasNode || !leafCanvasNode) return;

    const treeDrawingContext = treeCanvasNode.getContext("2d");
    const leafDrawingContext = leafCanvasNode.getContext("2d");
    if (!treeDrawingContext || !leafDrawingContext) return;

    const rootElement = rootNode;
    const treeCanvas = treeCanvasNode;
    const leafCanvas = leafCanvasNode;
    const treeContext = treeDrawingContext;
    const leafContext = leafDrawingContext;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const leaves: Leaf[] = [];
    let width = 0;
    let height = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let scaleX = 1;
    let scaleY = 1;
    let frame = 0;
    let previousTime = 0;
    let previousDraw = 0;
    let spawnAccumulator = 0;
    let wind = 0;
    let windTarget = 0;
    let nextGust = 0;
    let treeGustStartedAt = 0;
    let treeGustDuration = 0;
    let treeGustStrength = 0;
    let glitchStartedAt = 0;
    let accent = "#4f9ce8";
    let accentSoft = "#286ba9";
    let wood = "#596570";

    function readColors() {
      const styles = getComputedStyle(document.documentElement);
      accent = styles.getPropertyValue("--accent").trim() || "#4f9ce8";
      accentSoft = styles.getPropertyValue("--accent-soft").trim() || "#286ba9";
      wood = styles.getPropertyValue("--tree-wood").trim() || "#596570";
    }

    function dot(x: number, y: number, color: string, alpha = 1, size = 1) {
      const dotWidth = Math.max(1, Math.round(scaleX * 0.42 * size));
      const dotHeight = Math.max(1, Math.round(scaleY * 0.42 * size));
      treeContext.globalAlpha = alpha;
      treeContext.fillStyle = color;
      treeContext.fillRect(
        Math.round((x + 0.5) * scaleX - dotWidth / 2),
        Math.round((y + 0.5) * scaleY - dotHeight / 2),
        dotWidth,
        dotHeight,
      );
    }

    function drawTree(time = 0, bend = 0, driftX = 0, driftY = 0, rotation = 0, glitchStep = -1, glitchIntensity = 0) {
      for (let y = 0; y < GRID_HEIGHT; y += 1) {
        for (let x = 0; x < GRID_WIDTH; x += 1) {
          const character = TREE_MASK[y][x];
          if (character === " ") continue;
          const variation = noise(x, y);
          const flexibility = Math.pow(Math.max(0, (GRID_HEIGHT - y) / GRID_HEIGHT), 1.7);
          const branchFlutter = Math.sin(time * 0.0052 + y * 0.31 + x * 0.035) * Math.abs(bend) * 0.075 * flexibility;
          const anchoredDriftX = (driftX / scaleX) * flexibility;
          const anchoredDriftY = (driftY / scaleY) * flexibility;
          const anchoredRotation = rotation * (GRID_HEIGHT - y) * (scaleY / scaleX) * flexibility;
          let sliceShift = 0;
          if (glitchStep >= 0) {
            const anchors = [10, 19, 28, 37, 46];
            for (let slice = 0; slice < anchors.length; slice += 1) {
              const sliceHeight = 1 + Math.floor(noise(slice, glitchStep + 11) * 3);
              if (y >= anchors[slice] && y <= anchors[slice] + sliceHeight) {
                const direction = slice % 2 ? -1 : 1;
                sliceShift += direction * (1.4 + noise(glitchStep, slice + 19) * 3.2) * glitchIntensity;
              }
            }
          }
          const windX = bend * flexibility + branchFlutter + anchoredDriftX + anchoredRotation + sliceShift;
          const windY = -Math.abs(bend) * 0.028 * flexibility + anchoredDriftY;

          if (character === ".") {
            dot(x + windX + (variation - 0.5) * 0.18, y + windY, variation > 0.76 ? accentSoft : accent, 0.52 + variation * 0.44, 0.68 + variation * 0.38);
          } else if (character === "#") {
            dot(x + windX, y + windY, wood, 0.82 + variation * 0.17, 0.82 + variation * 0.26);
          } else {
            dot(x + windX, y + windY, wood, 0.58 + variation * 0.25, 0.62 + variation * 0.24);
          }
        }
      }
      treeContext.globalAlpha = 1;
    }

    function createLeaf(burst = false) {
      const origin = BLOSSOM_POINTS[Math.floor(Math.random() * BLOSSOM_POINTS.length)];
      const bounds = rootElement.getBoundingClientRect();
      leaves.push({
        x: bounds.left + (origin.x + 0.5) * scaleX + window.scrollX,
        y: bounds.top + (origin.y + 0.5) * scaleY + window.scrollY,
        velocityX: (Math.random() - 0.46) * (burst ? 150 : 38),
        velocityY: burst ? -50 - Math.random() * 125 : 16 + Math.random() * 24,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 7,
        size: 1.2 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        windResponse: 0.55 + Math.random() * 0.9,
      });
    }

    function resize() {
      const bounds = rootElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      scaleX = width / GRID_WIDTH;
      scaleY = height / GRID_HEIGHT;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      treeCanvas.width = Math.round(width * ratio);
      treeCanvas.height = Math.round(height * ratio);
      treeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      treeContext.imageSmoothingEnabled = false;
      leafCanvas.width = Math.round(viewportWidth * ratio);
      leafCanvas.height = Math.round(viewportHeight * ratio);
      leafContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      leafContext.imageSmoothingEnabled = false;
      readColors();
      treeContext.clearRect(0, 0, width, height);
      drawTree();
    }

    function releaseLeaves() {
      if (reduceMotion.matches) return;
      const time = performance.now();
      const direction = Math.random() > 0.2 ? 1 : -1;
      treeGustStartedAt = time;
      treeGustDuration = 980;
      treeGustStrength = direction * 4.8;
      glitchStartedAt = time;
      windTarget = direction * (145 + Math.random() * 65);
      nextGust = time + 1100;
      for (let index = 0; index < 34; index += 1) createLeaf(true);
    }

    function animate(time: number) {
      frame = requestAnimationFrame(animate);
      if (document.hidden) {
        previousTime = time;
        return;
      }
      if (time - previousDraw < 32) return;

      const delta = Math.min((time - previousTime) / 1000 || 0, 0.04);
      previousTime = time;
      previousDraw = time;
      spawnAccumulator += delta;

      let treeBend = 0;
      if (treeGustStartedAt) {
        const progress = (time - treeGustStartedAt) / treeGustDuration;
        if (progress >= 1) {
          treeGustStartedAt = 0;
        } else {
          const envelope = Math.pow(Math.sin(progress * Math.PI), 1.35);
          const turbulence = 1 + Math.sin(progress * Math.PI * 5.5) * 0.09;
          treeBend = treeGustStrength * envelope * turbulence;
        }
      }

      const ambientDriftX = Math.sin(time / 1350) * 7;
      const ambientDriftY = Math.cos(time / 1720) * 5;
      const ambientRotation = Math.sin(time / 2400) * 0.008;
      treeBend += Math.sin(time / 1350) * 0.72;

      let glitchStep = -1;
      let glitchIntensity = 0;
      let glitchBlackout = false;
      if (glitchStartedAt) {
        const progress = Math.min(1, (time - glitchStartedAt) / 560);
        glitchStep = Math.floor(progress * 11);
        glitchIntensity = 1 - progress;
        glitchBlackout = glitchStep === 0 || glitchStep === 2;
        if (progress >= 1) glitchStartedAt = 0;
      }

      if (time >= nextGust) {
        windTarget = (Math.random() - 0.48) * (32 + Math.random() * 92);
        nextGust = time + 900 + Math.random() * 2600;
      }
      wind += (windTarget - wind) * Math.min(1, delta * 0.75);

      if (spawnAccumulator > 0.24 && leaves.length < 220) {
        spawnAccumulator = 0;
        createLeaf();
      }

      treeContext.clearRect(0, 0, width, height);
      if (!glitchBlackout) {
        drawTree(time, treeBend, ambientDriftX, ambientDriftY, ambientRotation, glitchStep, glitchIntensity);
      }
      leafContext.clearRect(0, 0, viewportWidth, viewportHeight);
      const pageBottom = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - 3;
      const scrollLeft = window.scrollX;
      const scrollTop = window.scrollY;

      for (let index = leaves.length - 1; index >= 0; index -= 1) {
        const leaf = leaves[index];
        const flutter = Math.sin(time * 0.006 + leaf.phase) * 34;
        const crossCurrent = Math.sin(time * 0.0017 + leaf.phase * 2.3 + leaf.y * 0.003) * 18;
        leaf.velocityX += (wind * leaf.windResponse + flutter + crossCurrent) * delta;
        leaf.velocityX *= Math.pow(0.975, delta * 60);
        leaf.velocityY += (29 + Math.abs(Math.sin(leaf.rotation)) * 10) * delta;
        leaf.x += leaf.velocityX * delta;
        leaf.y += leaf.velocityY * delta;
        leaf.rotation += (leaf.rotationSpeed + leaf.velocityX * 0.012) * delta;

        if (leaf.y >= pageBottom) {
          leaves.splice(index, 1);
          continue;
        }

        const screenX = leaf.x - scrollLeft;
        const screenY = leaf.y - scrollTop;
        if (screenX < -12 || screenX > viewportWidth + 12 || screenY < -12 || screenY > viewportHeight + 12) continue;

        const squash = 0.35 + Math.abs(Math.cos(leaf.rotation)) * 0.9;
        leafContext.globalAlpha = 0.46 + Math.abs(Math.sin(leaf.rotation)) * 0.42;
        leafContext.fillStyle = accent;
        leafContext.save();
        leafContext.translate(Math.round(screenX), Math.round(screenY));
        leafContext.rotate(leaf.rotation);
        leafContext.fillRect(-leaf.size / 2, -(leaf.size * squash) / 2, leaf.size, leaf.size * squash);
        leafContext.restore();
      }

      leafContext.globalAlpha = 1;
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(resize);

    resizeObserver.observe(rootElement);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    rootElement.addEventListener("click", releaseLeaves);

    if (!reduceMotion.matches) frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      rootElement.removeEventListener("click", releaseLeaves);
    };
  }, []);

  return (
    <>
      <button ref={rootRef} className="ascii-sakura" type="button" aria-label="Release more leaves from the stippled sakura tree">
        <canvas ref={treeCanvasRef} aria-hidden="true" />
      </button>
      <canvas ref={leafCanvasRef} className="sakura-leaf-field" aria-hidden="true" />
    </>
  );
}
