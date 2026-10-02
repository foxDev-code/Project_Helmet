// Flood the neutral backdrop while preserving enclosed displays and boards.
export function removeFrameBackdrop(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let head = 0;
  let tail = 0;
  const visit = (pixel) => {
    if (visited[pixel]) return;
    visited[pixel] = 1;
    const index = pixel * 4;
    const low = Math.min(data[index], data[index + 1], data[index + 2]);
    const high = Math.max(data[index], data[index + 1], data[index + 2]);
    if (low < 105 || high > 225 || high - low > 18) return;
    data[index + 3] = 0;
    queue[tail++] = pixel;
  };
  for (let x = 0; x < width; x++) {
    visit(x);
    visit((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    visit(y * width);
    visit(y * width + width - 1);
  }
  // ponytail: these lower seeds cover this footage's enclosed strap loops;
  // differently composed footage needs its own matte rather than more seeds.
  for (const x of [.45, .5, .55]) {
    for (const y of [.7, .8, .85]) visit(Math.floor(y * height) * width + Math.floor(x * width));
  }
  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    if (x > 0) visit(pixel - 1);
    if (x < width - 1) visit(pixel + 1);
    if (pixel >= width) visit(pixel - width);
    if (pixel < width * (height - 1)) visit(pixel + width);
  }
}
