let sketch = function(p) {
  let width = 1600;
  let height = 1600;
  let offset = -300;
  let circular_shape = true;

  let flow_cell_size = 10;
  let number_of_layers = 1;

  let vertical_partitions = 1;
  let horizontal_partitions = 1;

  let vertical_shift = 200;
  let horizontal_shift = 40;

  let noise_size = 0.0025;
  let noise_radius = 0.008;

  let flow_width = (width + offset * 2) / flow_cell_size;
  let flow_height = (height + offset * 2) / flow_cell_size;

  let flow_grid = [];

  let noise_offset_x, noise_offset_y;
  p.setup = function() {
    p.createCanvas(width, height);
    p.smooth();
    p.noLoop();

    p.stroke(255, 85);
    p.strokeWeight(1);
  };
  p.draw = function() {
    p.background('#222');
    p.translate(-offset, -offset);

    noise_offset_x = p.random(10);
    noise_offset_y = p.random(10);
    for (var i = 0; i < number_of_layers; i++) {
      init_flow();
      display_flow(i);
    }
  };

  function init_flow() {
    flow_grid = [];
    for (let i = 0; i < flow_height; i++) {
      let row = [];
      for (let j = 0; j < flow_width; j++) {
        row.push(
          calculate_flow(
            (j + vertical_shift * p.floor((vertical_partitions * j) / flow_height)) * noise_size,
            (i + horizontal_shift * p.floor((horizontal_partitions * i) / flow_width)) * noise_size,
            noise_radius
          )
        );
      }
      flow_grid.push(row);
    }
  }

  function calculate_flow(lll, aaa, r) {
    let x = p.random(flow_width) * noise_size;
    let y = p.random(flow_height) * noise_size;
    let mean_arrow = p.createVector(0, 0);
    let radial_samples = 70;

    for (var i = 0; i < radial_samples; i++) {
      //let angle = p.random(p.PI);
      let angle = (i * p.PI) / radial_samples;
      let pos1 = p.createVector(x + p.cos(angle) * r, y + p.sin(angle) * r);
      let pos2 = p.createVector(x + p.cos(angle + p.PI) * r, y + p.sin(angle + p.PI) * r);

      let val1 = p.noise(noise_offset_x + pos1.x, noise_offset_y + pos1.y);
      let val2 = p.noise(noise_offset_x + pos2.x, noise_offset_y + pos2.y);

      let hilo = p5.Vector.sub(pos1, pos2)
        .normalize()
        .mult(val1 - val2);

      mean_arrow.add(hilo);
    }
    mean_arrow.div(radial_samples);
    mean_arrow.rotate(p.PI / 2);
    return { arrow: mean_arrow, pos: [x, y] };
  }

  function display_flow(col) {
    console.log(flow_width, flow_height);
    for (let i = 0; i < flow_grid.length; i++) {
      for (let j = 0; j < flow_grid[i].length; j++) {
        //if (!circular_shape || inside_radius(i - flow_grid.length / 2, j - flow_grid[i].length / 2, 35)) {
        p.line(
          (flow_grid[i][j].pos[0] * flow_cell_size) / noise_size,
          (flow_grid[i][j].pos[1] * flow_cell_size) / noise_size,
          (flow_grid[i][j].pos[0] * flow_cell_size) / noise_size + flow_grid[i][j].arrow.x * flow_cell_size * 2400,
          (flow_grid[i][j].pos[1] * flow_cell_size) / noise_size + flow_grid[i][j].arrow.y * flow_cell_size * 2400
        );
        //}
      }
    }
  }

  function inside_radius(x, y, r) {
    return p.sqrt(p.pow(x, 2) + p.pow(y, 2)) < r;
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('noise_grid', 'jpeg');
    }
  };
};
new p5(sketch);
