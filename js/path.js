/* =========================================================
   path.js
   สร้างเส้นทางเดินแบบ "บันไดงู" (ซิกแซกไปเรื่อย ๆ) บนเกาะ
   พร้อมป้ายเลขช่องสีสันสดใสลอยอยู่เหนือแต่ละช่อง
   tilePositions[i] = ตำแหน่ง 3D ของช่องที่ i (เริ่มนับจาก 0)
   ========================================================= */

const ROWS = 4;
const COLS = 6;
const TILE_SPACING = 3.4;
const TOTAL_TILES = ROWS * COLS; // 24 ช่อง

const tilePositions = [];
const tileMeshes = [];

// จานสีสดใสสำหรับป้ายเลขประจำช่อง (วนซ้ำไปเรื่อย ๆ)
const TILE_NUMBER_COLORS = ['#E4694C', '#3EC6A0', '#FFC94C', '#8B7FE8', '#4FC3F7', '#FF8A65', '#F472B6', '#A3E635'];

// วาดป้ายวงกลมสีพร้อมตัวเลขบนผิว canvas แล้วแปลงเป็น texture
function makeTileNumberTexture(number, bgColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);

  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Kanit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), 64, 68);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildPath() {
  const offsetX = ((COLS - 1) * TILE_SPACING) / 2;
  const offsetZ = ((ROWS - 1) * TILE_SPACING) / 2;

  for (let row = 0; row < ROWS; row++) {
    const isReversed = row % 2 === 1;
    for (let col = 0; col < COLS; col++) {
      const effectiveCol = isReversed ? (COLS - 1 - col) : col;
      const x = effectiveCol * TILE_SPACING - offsetX;
      const z = row * TILE_SPACING - offsetZ;
      tilePositions.push(new THREE.Vector3(x, 0.35, z));
    }
  }

  tilePositions.forEach((pos, i) => {
    const tileGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
    const isLast = i === TOTAL_TILES - 1;
    const tileMat = new THREE.MeshStandardMaterial({
      color: isLast ? 0xFFE49C : (i % 2 === 0 ? 0xE9D8A6 : 0xDCC488)
    });
    const tile = new THREE.Mesh(tileGeo, tileMat);
    tile.position.copy(pos);
    tile.receiveShadow = true;
    islandGroup.add(tile);
    tileMeshes.push(tile);

    // ป้ายเลขช่องสีสัน ลอยแบนอยู่เหนือผิวช่องเล็กน้อย
    const color = TILE_NUMBER_COLORS[i % TILE_NUMBER_COLORS.length];
    const labelTex = makeTileNumberTexture(i + 1, color);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), labelMat);
    label.rotation.x = -Math.PI / 2;
    label.position.set(pos.x, pos.y + 0.09, pos.z);
    islandGroup.add(label);
  });

  const lineGeo = new THREE.BufferGeometry().setFromPoints(
    tilePositions.map(p => new THREE.Vector3(p.x, p.y + 0.1, p.z))
  );
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  islandGroup.add(new THREE.Line(lineGeo, lineMat));
}
buildPath();
