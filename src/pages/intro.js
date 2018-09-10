import React, { Component, Fragment } from "react";
import Logo from "../../public/images/logo.jpg";
import Lightning from "../../public/images/lightning.svg";
import $ from "jquery";
import "./intro.css";
export class Intro extends Component {
  componentDidMount() {
    const pi = Math.PI;
    //const ctx = document.getElementById("myChart").getContext('2d');

    const canvas = {
      width: $(window).innerWidth() - 20,
      height: $(window).innerHeight() - 20
    };

    function ontehResize() {
      $("#lightningSvg:first").attr("width", $(window).innerWidth() - 20 + "");
      $("#lightningSvg:first").attr(
        "height",
        $(window).innerHeight() - 20 + ""
      );
    }
    ontehResize();

    var interval = 2000;
    var intervalEvolId;
    var intervalStrikeId;

    var startPoint = { x: canvas.width / 2, y: 50 };
    var aimNumber = { x: canvas.width / 2, y: canvas.height - 100 };

    var pop;
    var pause = false;
    var stepRange = 2; //2pi, 1 one way and one the other

    //Change these to make it look cool
    class LightningProps {
      constructor(type) {
        if (!type) {
          type = "default";
        }
        if (type == "fast") {
          this.FrameRate = 120; //
          this.numberOfSteps = 20; //
          this.popSize = 200; //
          this.probias = 2; //
          this.mutateRate = 0.08;
          this.opacity = 0.045; //
          this.strikeTimer = 1500;
          this.stretchLength = 40;
          this.bgOpacity = 1;
        } else if (type == "slow") {
          this.FrameRate = 100; //
          this.numberOfSteps = 150; //
          this.popSize = 500; //
          this.probias = 0.88; //
          this.mutateRate = 0.01;
          this.opacity = 0.0168; //
          this.strikeTimer = 18000;
          this.stretchLength = 8;
          this.bgOpacity = 1;
        } else if (type == "rediculous") {
          this.FrameRate = 100; //
          this.numberOfSteps = 200; //
          this.popSize = 2000; //
          this.probias = 1.1; //
          this.mutateRate = 0.006;
          this.opacity = 0.01; //
          this.strikeTimer = 10000000000000000;
          this.stretchLength = 50;
          this.bgOpacity = 1;
        } else {
          this.FrameRate = 100; //
          this.numberOfSteps = 60; //
          this.popSize = 500; //
          this.probias = 0.7; //
          this.mutateRate = 0.01;
          this.opacity = 0.01; //
          this.strikeTimer = 7000;
          this.stretchLength = 21;
          this.bgOpacity = 1;
        }
      }
    }

    var properties = new LightningProps();

    //var        FrameRate = 10;//
    //var    numberOfSteps = 60;//
    //var          popSize = 500;//
    //var          probias = 0.7;//
    //var       mutateRate = 0.01;
    //var          opacity = 0.01;//
    //var      strikeTimer = 7000;
    //var    stretchLength = 21;

    //---------===================--Controls--=====================-----------

    function setUpControls() {
      $("body").mousemove(function(e) {
        var rect = $("#lightningSvg")[0].getBoundingClientRect();
        aimNumber.x = realMousePos(e).x;
        aimNumber.y = realMousePos(e).y;
      });

      $("body").dblclick(function(e) {
        MakeNewPop(e);
        e.preventDefault();
      });
      $("#lightningSvg").on("click", function() {
        pause = !pause;
      });
    }
    //-----------===================-update Loop---====================-----------

    //Randomly change striking point

    /*setInterval(function(){
      aimNumber.x=Math.random()*canvas.width;aimNumber.y=Math.random()*canvas.height;
    },properties.strikeTimer);*/

    function UpdateStrikerTimer(val) {
      properties.strikeTimer = Number(val);
      // clear the existing interval
      clearInterval(intervalStrikeId);
      // just start a new one
      startStrikerLoop(properties.strikeTimer);
    }
    startStrikerLoop(properties.strikeTimer);
    function startStrikerLoop(_sinterval) {
      intervalStrikeId = setInterval(function() {
        changeStrike();
      }, _sinterval);
    }
    function changeStrike() {
      aimNumber.x = Math.random() * canvas.width;
      aimNumber.y = Math.random() * canvas.height;
    }

    //----------Evol Loop------

    function UpdateFrameRate(value) {
      properties.FrameRate = Number(value);
      // clear the existing interval
      clearInterval(intervalEvolId);
      // just start a new one
      startEvolutionLoop(Math.round((1 / properties.FrameRate) * 1000));
    }
    startEvolutionLoop(Math.round((1 / properties.FrameRate) * 1000));
    function startEvolutionLoop(_interval) {
      intervalEvolId = setInterval(function() {
        evolutionLoop();
      }, _interval);
    }
    function getInterval() {
      return interval;
    }

    function evolutionLoop() {
      if (pop && !pause) {
        pop.calcualteFitness();

        //DrawGraph();
        drawSvg();

        if ($("#record").prop("checked")) {
          recordFrame();
        }
        pop.survivalOfFittest();
        pop.mutateBebes();
      }
      if (!properties) {
        properties = new LightningProps();
      }
      if (!pop) {
        pop = new Population(properties.popSize);
        setUpSvg();
        drawSvg();
        setUpControls();
        ontehResize();
      }
    }

    //-------------------Population Stuff---------------------
    function MakeNewPop(e) {
      if (e) {
        startPoint = { x: realMousePos(e).x, y: realMousePos(e).y };
      }
      pop = new Population(properties.popSize);
      pop.calculateFitness();
      //DrawGraph();
    }

    class Population {
      constructor(PopCount) {
        this.people = [];
        for (var i = 0; i < PopCount; i++) {
          this.people[i] = new Mather(properties.numberOfSteps);
        }
      }

      calcualteFitness() {
        for (var i = 0; i < this.people.length; i++) {
          this.people[i].calcFitness(aimNumber);
        }

        this.people = this.people.sort(function(a, b) {
          return b.fitness - a.fitness;
        });
      }

      survivalOfFittest() {
        var fitenssSum = 0;
        for (var i = 0; i < this.people.length; i++) {
          fitenssSum += this.people[i].fitness;
        }

        var repros = [];

        //sort by fitness
        this.people = this.people.sort(function(a, b) {
          return b.fitness - a.fitness;
        });

        var numOfBebes = this.people.length;
        var bebeCount = 0;
        var EndOfRepro = false;
        for (var i = 0; i < numOfBebes; i++) {
          //for each of the people in order of fitness
          var numOfBebesForThis =
            properties.probias *
            Math.round((this.people[i].fitness / fitenssSum) * numOfBebes);
          if (i == 0) {
            $("#moarText").text(numOfBebesForThis);
          }
          //find out how many bebes u should have
          for (var k = 0; k <= numOfBebesForThis; k++) {
            //make them
            if (bebeCount >= numOfBebes) {
              if (!EndOfRepro) {
                $("#moarText").text($("#moarText").text() + " " + i);
                EndOfRepro = true;
              }
              break;
            } else {
              repros[bebeCount] = this.people[i].mekBebe();
              bebeCount++;
            }
          }
          if (bebeCount >= numOfBebes) {
            break;
          }
          //this way rounding screws over the rubbish ones
        }
        this.people = repros;
      }

      mutateBebes() {
        var bebes = [];
        for (var i = 0; i < this.people.length; i++) {
          bebes[i] = this.people[i].mutate();
        }
      }
    }

    class Mather {
      constructor(steps) {
        this.steps = [];
        this.result = [];

        for (var i = 0; i < steps; i++) {
          this.addStep();
        }
        this.fitness = 0;
      }

      sum() {
        var previousPos = startPoint;
        for (var i = 0; i < this.steps.length; i++) {
          var vec = { x: 0, y: 0 };
          vec.x =
            previousPos.x +
            Math.sin(pi * this.steps[i]) * properties.stretchLength;
          vec.y =
            previousPos.y +
            Math.cos(pi * this.steps[i]) * properties.stretchLength;
          previousPos = vec;
          this.result[i] = vec;
        }
        return this.result[this.result.length - 1];
      }
      addStep() {
        this.steps[this.steps.length] = this.randomStep(stepRange) * 1;
      }
      calcFitness(aim) {
        var endPoint = this.sum();
        var distanceFromAim = Math.sqrt(
          Math.pow(endPoint.x - aim.x, 2) + Math.pow(endPoint.y - aim.y, 2)
        );
        var ftness = 1 / distanceFromAim;
        if (ftness < 0) {
          ftness = ftness * -1;
        }
        this.fitness = ftness;
      }

      mutate() {
        for (var i = 0; i < this.steps.length; i++) {
          if (Math.random() < properties.mutateRate) {
            this.steps[i] = this.randomStep(stepRange);
          }
        }
      }

      mekBebe() {
        var bebe = new Mather();
        bebe.steps = this.steps.slice(0);
        return bebe;
      }

      randomStep(range) {
        if (!range) {
          range = 1;
        }
        return Math.random() * range - range / 2;
      }
    }
    function getMax(numArray) {
      return Math.max.apply(null, numArray);
    }
    function getMin(numArray) {
      return Math.min.apply(null, numArray);
    }
    function realMousePos(evt) {
      var rect = $("#lightningSvg")[0].getBoundingClientRect();
      var vec = { x: 0, y: 0 };
      vec.x = evt.clientX - rect.left;
      vec.y = evt.clientY - rect.top;
      return vec;
    }

    //--------------------===============--Rendering---======================---------------------
    function setUpSvg() {
      var svgString = "<svg id='lightningSvg' width='10' height='10'>";
      for (var i = 0; i < pop.people.length; i++) {
        svgString +=
          "<polyline id='line" +
          i +
          "' points='' d=''fill='none' stroke='white'/>";
      }
      svgString += "</svg>";
      $("#svg").html(svgString);
      drawSvg();
    }

    function makePersonSvg(mather) {
      var path = mather.result;
      var svgout = "";

      for (var i = 1; i < path.length; i++) {
        svgout += " " + path[i].x + "," + path[i].y;
      }
      return svgout;
    }

    function drawSvg() {
      for (var i = 0; i < properties.popSize; i++) {
        $("#line" + i).attr("points", makePersonSvg(pop.people[i]));
        $("#line" + i).attr("stroke-opacity", properties.opacity);
        //svgString+=("<polyline id='line"+i+"' points='' d=''fill='none' stroke='white'/>");
      }
    }
  }
  render() {
    return (
      <Fragment>
        <div className="logo shadow shadow-lg">
          <div className="intro__logo_mask" />
          <img className="img-fluid logo_avatar center_position" src={Logo} />
          <span class="dever_name">Phạm Hoàng Thịnh</span>

          <div id="svg" class="lightningSvg" />
        </div>
        <p className="intro_sologan">
          Tôi là Developer.Và đây là nơi tôi lưu trữ cuộc đời lập trình của tôi
          <br />
          Cảm ơn bạn đã quan tâm tới tôi!
        </p>
      </Fragment>
    );
  }
}
