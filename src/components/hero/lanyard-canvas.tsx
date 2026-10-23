import { useEffect, useMemo, useRef, useState } from "react";
import type { LanyardBadgeData } from "./lanyard-types";

const CARD_WIDTH = 2.45;
const CARD_HEIGHT = 3.37;
const ROPE_SEGMENTS = 13;
const ROPE_LENGTH = 1.55;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "ID";

const isLocalImage = (url: string | undefined) => Boolean(url?.startsWith("/"));

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function clippedPhoto(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;

  context.save();
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.clip();
  context.drawImage(image, x + (size - width) / 2, y + (size - height) / 2, width, height);
  context.restore();
}

function fillWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (line && context.measureText(nextLine).width > maxWidth) {
      context.fillText(line, x, y);
      y += lineHeight;
      line = word;
      return;
    }
    line = nextLine;
  });

  if (line) context.fillText(line, x, y);
}

function paintBadgeFront(
  canvas: HTMLCanvasElement,
  badge: LanyardBadgeData,
  profilePhoto: HTMLImageElement | null,
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffdf8";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#1b1915";
  context.fillRect(0, 0, width, 142);
  context.fillStyle = "#f15a24";
  context.fillRect(0, 142, width, 16);

  context.fillStyle = "#f7f2e8";
  context.font = "700 40px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(`${initialsFor(badge.name)}.`, 68, 83);
  context.textAlign = "right";
  context.font = "600 23px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("PROFILE BADGE", width - 68, 77);
  context.textAlign = "left";

  const photoSize = 222;
  const photoX = 68;
  const photoY = 220;
  if (profilePhoto) {
    clippedPhoto(context, profilePhoto, photoX, photoY, photoSize);
  } else {
    const gradient = context.createLinearGradient(
      photoX,
      photoY,
      photoX + photoSize,
      photoY + photoSize,
    );
    gradient.addColorStop(0, "#0c4a2e");
    gradient.addColorStop(1, "#1b1915");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f7f2e8";
    context.textAlign = "center";
    context.font = "700 84px ui-sans-serif, system-ui, sans-serif";
    context.fillText(initialsFor(badge.name), photoX + photoSize / 2, photoY + 142);
    context.textAlign = "left";
  }
  context.lineWidth = 10;
  context.strokeStyle = "#f15a24";
  context.beginPath();
  context.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 2, 0, Math.PI * 2);
  context.stroke();

  const textX = photoX + photoSize + 44;
  context.fillStyle = "#71695f";
  context.font = "600 21px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("ENGINEERING PORTFOLIO", textX, 258);
  context.fillStyle = "#1b1915";
  context.font = "700 56px ui-sans-serif, system-ui, sans-serif";
  context.fillText(badge.name, textX, 326);
  context.fillStyle = "#0c4a2e";
  context.font = "600 38px ui-sans-serif, system-ui, sans-serif";
  fillWrappedText(context, badge.title, textX, 380, width - textX - 68, 43);

  context.strokeStyle = "#d8cbbb";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(68, 500);
  context.lineTo(width - 68, 500);
  context.stroke();

  context.fillStyle = "#71695f";
  context.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("LOCATION", 68, 560);
  context.fillStyle = "#1b1915";
  context.font = "500 38px ui-sans-serif, system-ui, sans-serif";
  context.fillText(badge.location, 68, 608);

  context.fillStyle = "#71695f";
  context.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText("STACK", 68, 694);
  const technologies = badge.technologies.slice(0, 5);
  const rows = [technologies.slice(0, 2), technologies.slice(2, 4), technologies.slice(4)];
  rows.forEach((row, rowIndex) => {
    if (!row.length) return;
    let x = 68;
    const y = 750 + rowIndex * 64;
    context.font = "600 30px ui-monospace, SFMono-Regular, Menlo, monospace";
    row.forEach((technology) => {
      const label = technology.toUpperCase();
      const labelWidth = context.measureText(label).width + 36;
      roundedRect(context, x, y - 40, labelWidth, 54, 7);
      context.fillStyle = "#efe7d9";
      context.fill();
      context.fillStyle = "#1b1915";
      context.fillText(label, x + 18, y);
      x += labelWidth + 14;
    });
  });

  if (badge.availability) {
    roundedRect(context, 68, height - 190, width - 136, 86, 8);
    context.fillStyle = "#0c4a2e";
    context.fill();
    context.fillStyle = "#f15a24";
    context.beginPath();
    context.arc(108, height - 147, 11, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f7f2e8";
    context.font = "700 31px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.fillText(badge.availability.toUpperCase(), 138, height - 138);
  }

  context.fillStyle = "#71695f";
  context.font = "600 17px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(`ID / ${initialsFor(badge.name)}`, 68, height - 48);
  context.textAlign = "right";
  context.fillText(badge.name.toUpperCase(), width - 68, height - 48);
  context.textAlign = "left";
}

function paintBadgeBack(canvas: HTMLCanvasElement, badge: LanyardBadgeData) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const { width, height } = canvas;
  context.fillStyle = "#1b1915";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#0c4a2e";
  context.fillRect(0, 0, width, 146);
  context.fillStyle = "#f15a24";
  context.fillRect(0, 146, width, 16);
  context.fillStyle = "#f7f2e8";
  context.textAlign = "center";
  context.font = "700 156px ui-sans-serif, system-ui, sans-serif";
  context.fillText(initialsFor(badge.name), width / 2, height / 2 - 20);
  context.font = "600 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(badge.title.toUpperCase(), width / 2, height / 2 + 48);
  context.fillStyle = "#d8cbbb";
  context.fillRect(68, height - 170, width - 136, 2);
  context.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.fillText(badge.name.toUpperCase(), width / 2, height - 104);
  context.textAlign = "left";
}

/**
 * Browser-only Three.js adaptation of React Bits' Lanyard. The physical badge,
 * woven strap, and all visible profile details are rendered inside WebGL; the
 * HTML below is only the no-WebGL/loading fallback.
 */
export default function LanyardCanvas({ badge }: { badge: LanyardBadgeData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasActive, setCanvasActive] = useState(false);
  const { availability, location, name, photoUrl, technologies, title } = badge;
  const sceneBadge = useMemo(
    () => ({
      name,
      title,
      location,
      technologies,
      ...(availability ? { availability } : {}),
      ...(photoUrl ? { photoUrl } : {}),
    }),
    [availability, location, name, photoUrl, technologies, title],
  );

  useEffect(() => {
    let alive = true;
    let teardown = () => undefined;

    setCanvasActive(false);

    void import("three")
      .then((THREE) => {
        const container = containerRef.current;
        if (!alive || !container) return;

        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
        } catch {
          return;
        }

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;

        const canvas = renderer.domElement;
        canvas.className = "absolute inset-0 block h-full w-full";
        canvas.style.touchAction = "none";
        canvas.setAttribute("aria-hidden", "true");
        container.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
        const keyLight = new THREE.DirectionalLight(0xfff6e4, 3.1);
        keyLight.position.set(-3, 5, 6);
        const fillLight = new THREE.DirectionalLight(0xa9c9b5, 1.35);
        fillLight.position.set(4, 1, 4);
        const rimLight = new THREE.DirectionalLight(0xf15a24, 1.5);
        rimLight.position.set(-4, -2, 3);
        scene.add(
          keyLight,
          fillLight,
          rimLight,
          new THREE.HemisphereLight(0xfff6e4, 0x0c4a2e, 1.25),
        );

        const frontCanvas = document.createElement("canvas");
        frontCanvas.width = 960;
        frontCanvas.height = 1320;
        const backCanvas = document.createElement("canvas");
        backCanvas.width = 960;
        backCanvas.height = 1320;
        paintBadgeFront(frontCanvas, sceneBadge, null);
        paintBadgeBack(backCanvas, sceneBadge);

        const frontTexture = new THREE.CanvasTexture(frontCanvas);
        const backTexture = new THREE.CanvasTexture(backCanvas);
        frontTexture.colorSpace = THREE.SRGBColorSpace;
        backTexture.colorSpace = THREE.SRGBColorSpace;
        frontTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        backTexture.anisotropy = frontTexture.anisotropy;

        const strapCanvas = document.createElement("canvas");
        strapCanvas.width = 96;
        strapCanvas.height = 240;
        const strapContext = strapCanvas.getContext("2d");
        if (strapContext) {
          strapContext.fillStyle = "#0c4a2e";
          strapContext.fillRect(0, 0, strapCanvas.width, strapCanvas.height);
          strapContext.fillStyle = "rgba(247, 242, 232, 0.2)";
          for (let y = 0; y < strapCanvas.height; y += 10)
            strapContext.fillRect(0, y, strapCanvas.width, 3);
          strapContext.fillStyle = "#f15a24";
          strapContext.fillRect(30, 0, 36, strapCanvas.height);
        }
        const strapTexture = new THREE.CanvasTexture(strapCanvas);
        strapTexture.colorSpace = THREE.SRGBColorSpace;
        strapTexture.wrapS = THREE.ClampToEdgeWrapping;
        strapTexture.wrapT = THREE.RepeatWrapping;
        strapTexture.repeat.set(1, 2.4);

        const shape = new THREE.Shape();
        const radius = 0.11;
        const x = -CARD_WIDTH / 2;
        const y = -CARD_HEIGHT / 2;
        shape.moveTo(x + radius, y);
        shape.lineTo(x + CARD_WIDTH - radius, y);
        shape.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + radius);
        shape.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - radius);
        shape.quadraticCurveTo(
          x + CARD_WIDTH,
          y + CARD_HEIGHT,
          x + CARD_WIDTH - radius,
          y + CARD_HEIGHT,
        );
        shape.lineTo(x + radius, y + CARD_HEIGHT);
        shape.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - radius);
        shape.lineTo(x, y + radius);
        shape.quadraticCurveTo(x, y, x + radius, y);

        const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
          bevelEnabled: true,
          bevelSegments: 3,
          bevelSize: 0.018,
          bevelThickness: 0.018,
          curveSegments: 20,
          depth: 0.07,
        });
        bodyGeometry.translate(0, 0, -0.035);
        const faceGeometry = new THREE.ShapeGeometry(shape, 20);
        const edgeMaterial = new THREE.MeshPhysicalMaterial({
          color: "#d8cbbb",
          roughness: 0.32,
          metalness: 0.16,
          clearcoat: 0.55,
        });
        const frontMaterial = new THREE.MeshPhysicalMaterial({
          map: frontTexture,
          roughness: 0.36,
          metalness: 0.02,
          clearcoat: 0.5,
          clearcoatRoughness: 0.18,
          side: THREE.DoubleSide,
        });
        const backMaterial = new THREE.MeshPhysicalMaterial({
          map: backTexture,
          roughness: 0.38,
          metalness: 0.03,
          clearcoat: 0.45,
          clearcoatRoughness: 0.2,
          side: THREE.DoubleSide,
        });
        const metalMaterial = new THREE.MeshStandardMaterial({
          color: "#c7c9c8",
          metalness: 0.9,
          roughness: 0.22,
        });

        const card = new THREE.Group();
        const cardBody = new THREE.Mesh(bodyGeometry, edgeMaterial);
        const cardFront = new THREE.Mesh(faceGeometry, frontMaterial);
        cardFront.position.z = 0.055;
        const cardBack = new THREE.Mesh(faceGeometry.clone(), backMaterial);
        cardBack.rotation.y = Math.PI;
        cardBack.position.z = -0.055;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.017, 14, 40), metalMaterial);
        ring.position.y = CARD_HEIGHT / 2 + 0.11;
        ring.rotation.x = Math.PI / 2;
        const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.1), metalMaterial);
        clasp.position.y = CARD_HEIGHT / 2 + 0.21;
        card.add(cardBody, cardFront, cardBack, ring, clasp);
        scene.add(card);

        const ropeGeometry = new THREE.BufferGeometry();
        const ropePositions = new Float32Array((ROPE_SEGMENTS + 1) * 2 * 3);
        const ropeUvs = new Float32Array((ROPE_SEGMENTS + 1) * 2 * 2);
        const ropeIndices: number[] = [];
        for (let index = 0; index <= ROPE_SEGMENTS; index += 1) {
          const vertexOffset = index * 2;
          const uvOffset = index * 4;
          const v = index / ROPE_SEGMENTS;
          ropeUvs.set([0, v, 1, v], uvOffset);
          if (index < ROPE_SEGMENTS) {
            ropeIndices.push(
              vertexOffset,
              vertexOffset + 1,
              vertexOffset + 2,
              vertexOffset + 1,
              vertexOffset + 3,
              vertexOffset + 2,
            );
          }
        }
        ropeGeometry.setAttribute("position", new THREE.BufferAttribute(ropePositions, 3));
        ropeGeometry.setAttribute("uv", new THREE.BufferAttribute(ropeUvs, 2));
        ropeGeometry.setIndex(ropeIndices);
        const ropeMaterial = new THREE.MeshPhysicalMaterial({
          map: strapTexture,
          roughness: 0.6,
          metalness: 0,
          sheen: 0.35,
          side: THREE.DoubleSide,
        });
        const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
        rope.frustumCulled = false;
        scene.add(rope);

        const anchorMarker = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 18), metalMaterial);
        scene.add(anchorMarker);

        const anchor = new THREE.Vector3();
        const attachment = new THREE.Vector3();
        const body = {
          position: new THREE.Vector3(),
          previous: new THREE.Vector3(),
          velocity: new THREE.Vector3(),
          quaternion: new THREE.Quaternion(),
          angularVelocity: new THREE.Vector3(),
          localAttachment: new THREE.Vector3(0, CARD_HEIGHT / 2 + 0.27, 0),
        };
        const nodes = Array.from({ length: ROPE_SEGMENTS + 1 }, () => new THREE.Vector3());
        const previousNodes = Array.from({ length: ROPE_SEGMENTS + 1 }, () => new THREE.Vector3());
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const localPoint = new THREE.Vector3();
        const worldPoint = new THREE.Vector3();
        const delta = new THREE.Vector3();
        const correction = new THREE.Vector3();
        const tangent = new THREE.Vector3();
        const side = new THREE.Vector3();
        const cameraDirection = new THREE.Vector3();
        const axis = new THREE.Vector3();
        const temporaryQuaternion = new THREE.Quaternion();
        const restQuaternion = new THREE.Quaternion();
        const restEuler = new THREE.Euler();
        let worldHeight = 7;
        let initialized = false;
        let visible = true;
        let flipped = false;
        let raf = 0;
        let lastTime = performance.now();
        let elapsed = 0;
        let grab:
          | {
              local: InstanceType<typeof THREE.Vector3>;
              target: InstanceType<typeof THREE.Vector3>;
              distance: number;
              pointerId: number;
              startX: number;
              startY: number;
              hasMoved: boolean;
            }
          | undefined;
        const reducedMotion =
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

        const getAttachment = (target: InstanceType<typeof THREE.Vector3>) =>
          target.copy(body.localAttachment).applyQuaternion(body.quaternion).add(body.position);

        const reset = (withImpulse: boolean) => {
          body.quaternion.setFromEuler(new THREE.Euler(-0.06, 0.16, -0.04));
          attachment.copy(body.localAttachment).applyQuaternion(body.quaternion);
          body.position.set(0.08, anchor.y - ROPE_LENGTH, 0).sub(attachment);
          getAttachment(attachment);
          nodes.forEach((node, index) => {
            node.lerpVectors(anchor, attachment, index / ROPE_SEGMENTS);
            previousNodes[index]!.copy(node);
          });
          body.previous.copy(body.position);
          body.velocity.set(withImpulse ? 0.45 : 0, 0, withImpulse ? 0.12 : 0);
          body.angularVelocity.set(withImpulse ? 0.24 : 0, withImpulse ? 0.16 : 0, 0);
        };

        const updateRope = () => {
          const position = ropeGeometry.getAttribute("position") as InstanceType<
            typeof THREE.BufferAttribute
          >;
          for (let index = 0; index <= ROPE_SEGMENTS; index += 1) {
            const node = nodes[index]!;
            const before = nodes[Math.max(0, index - 1)]!;
            const after = nodes[Math.min(ROPE_SEGMENTS, index + 1)]!;
            tangent.subVectors(after, before).normalize();
            cameraDirection.subVectors(camera.position, node).normalize();
            side.crossVectors(cameraDirection, tangent);
            if (side.lengthSq() < 0.00001) side.set(1, 0, 0);
            side.normalize().multiplyScalar(0.1);
            const offset = index * 2;
            position.setXYZ(offset, node.x + side.x, node.y + side.y, node.z + side.z);
            position.setXYZ(offset + 1, node.x - side.x, node.y - side.y, node.z - side.z);
          }
          position.needsUpdate = true;
          ropeGeometry.computeVertexNormals();
        };

        const constrainRope = () => {
          getAttachment(attachment);
          nodes[0]!.copy(anchor);
          nodes[ROPE_SEGMENTS]!.copy(attachment);
          const segmentLength = ROPE_LENGTH / ROPE_SEGMENTS;
          for (let iteration = 0; iteration < 6; iteration += 1) {
            for (let index = 0; index < ROPE_SEGMENTS; index += 1) {
              const first = nodes[index]!;
              const second = nodes[index + 1]!;
              delta.subVectors(second, first);
              const distance = delta.length();
              if (distance <= segmentLength || distance === 0) continue;
              correction.copy(delta).multiplyScalar((distance - segmentLength) / distance);
              if (index === 0) {
                second.sub(correction);
              } else if (index === ROPE_SEGMENTS - 1) {
                first.add(correction);
              } else {
                first.addScaledVector(correction, 0.5);
                second.addScaledVector(correction, -0.5);
              }
            }
            nodes[0]!.copy(anchor);
            nodes[ROPE_SEGMENTS]!.copy(getAttachment(attachment));
          }
        };

        const step = (dt: number) => {
          elapsed += dt;
          const bodyDamping = Math.exp(-1.85 * dt);
          const angularDamping = Math.exp(-3.5 * dt);
          const nodeDamping = Math.exp(-3.2 * dt);

          if (grab) {
            localPoint.copy(grab.local).applyQuaternion(body.quaternion).add(body.position);
            delta.subVectors(grab.target, localPoint);
            body.velocity.addScaledVector(delta, 38 * dt);
            correction.crossVectors(localPoint.sub(body.position), delta).multiplyScalar(10 * dt);
            body.angularVelocity.add(correction);
          }

          body.velocity.y -= 5.4 * dt;
          body.velocity.multiplyScalar(bodyDamping);
          body.previous.copy(body.position);
          body.position.addScaledVector(body.velocity, dt);

          const angularLength = body.angularVelocity.length();
          if (angularLength > 0.00001) {
            axis.copy(body.angularVelocity).divideScalar(angularLength);
            temporaryQuaternion.setFromAxisAngle(axis, angularLength * dt);
            body.quaternion.multiply(temporaryQuaternion).normalize();
          }
          body.angularVelocity.multiplyScalar(angularDamping);

          if (!grab) {
            restEuler.set(0, flipped ? Math.PI : 0, 0);
            restQuaternion.setFromEuler(restEuler);
            body.quaternion.slerp(restQuaternion, 1 - Math.exp(-0.55 * dt));
          }

          getAttachment(attachment);
          delta.subVectors(attachment, anchor);
          const distance = delta.length();
          if (distance > ROPE_LENGTH) {
            correction.copy(delta).multiplyScalar((distance - ROPE_LENGTH) / distance);
            body.position.sub(correction);
            body.velocity.addScaledVector(correction, -0.45 / Math.max(dt, 0.001));
          }

          const horizontalLimit = Math.max(
            0,
            (worldHeight * camera.aspect) / 2 - CARD_WIDTH / 2 - 0.08,
          );
          body.position.x = clamp(body.position.x, -horizontalLimit, horizontalLimit);
          body.position.y = clamp(
            body.position.y,
            -worldHeight / 2 + CARD_HEIGHT / 2 + 0.12,
            worldHeight / 2 - CARD_HEIGHT / 2 - 0.12,
          );

          for (let index = 1; index < ROPE_SEGMENTS; index += 1) {
            const node = nodes[index]!;
            const previousNode = previousNodes[index]!;
            worldPoint.copy(node);
            delta.subVectors(node, previousNode).multiplyScalar(nodeDamping);
            node.add(delta);
            node.y -= 5.4 * dt * dt;
            if (!reducedMotion) node.x += Math.sin(elapsed * 1.6 + index) * 0.0007;
            previousNode.copy(worldPoint);
          }
          constrainRope();
          card.position.copy(body.position);
          card.quaternion.copy(body.quaternion);
          updateRope();
        };

        const render = () => renderer.render(scene, camera);
        const isMoving = () =>
          Boolean(grab) || body.velocity.lengthSq() + body.angularVelocity.lengthSq() > 0.00016;
        const start = () => {
          if (raf || !visible || !alive) return;
          lastTime = performance.now();
          raf = requestAnimationFrame(animate);
        };
        const animate = (now: number) => {
          raf = 0;
          if (!alive || !visible) return;
          const dt = Math.min(1 / 30, Math.max(1 / 240, (now - lastTime) / 1000));
          lastTime = now;
          step(dt);
          render();
          if (isMoving()) raf = requestAnimationFrame(animate);
        };

        const resize = () => {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          worldHeight = Math.max(5.9, 2.85 / camera.aspect);
          camera.position.set(0, 0, worldHeight / (2 * Math.tan((camera.fov * Math.PI) / 360)));
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          const oldAnchorY = anchor.y;
          anchor.set(0, worldHeight / 2 - 0.35, 0);
          anchorMarker.position.copy(anchor);
          if (!initialized) {
            reset(!reducedMotion);
            initialized = true;
          } else {
            const shift = anchor.y - oldAnchorY;
            body.position.y += shift;
            body.previous.y += shift;
            nodes.forEach((node) => (node.y += shift));
            previousNodes.forEach((node) => (node.y += shift));
          }
          card.position.copy(body.position);
          card.quaternion.copy(body.quaternion);
          getAttachment(attachment);
          nodes[0]!.copy(anchor);
          nodes[ROPE_SEGMENTS]!.copy(attachment);
          updateRope();
          render();
          start();
        };

        const toPointer = (event: PointerEvent) => {
          const bounds = canvas.getBoundingClientRect();
          pointer.set(
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
          );
          raycaster.setFromCamera(pointer, camera);
        };

        const onPointerDown = (event: PointerEvent) => {
          if (event.button !== 0) return;
          toPointer(event);
          const hit = raycaster.intersectObject(card, true)[0];
          if (!hit) return;
          grab = {
            local: hit.point
              .clone()
              .sub(body.position)
              .applyQuaternion(body.quaternion.clone().invert()),
            target: hit.point.clone(),
            distance: hit.distance,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            hasMoved: false,
          };
          canvas.setPointerCapture(event.pointerId);
          canvas.style.cursor = "grabbing";
          event.preventDefault();
          start();
        };
        const onPointerMove = (event: PointerEvent) => {
          toPointer(event);
          if (grab) {
            const travelX = event.clientX - grab.startX;
            const travelY = event.clientY - grab.startY;
            grab.hasMoved ||= travelX * travelX + travelY * travelY > 64;
            raycaster.ray.at(grab.distance, grab.target);
            event.preventDefault();
            start();
            return;
          }
          canvas.style.cursor = raycaster.intersectObject(card, true).length ? "grab" : "";
        };
        const release = (event: PointerEvent) => {
          if (!grab || event.pointerId !== grab.pointerId) return;
          const shouldFlip = event.type === "pointerup" && !grab.hasMoved;
          grab = undefined;
          if (canvas.hasPointerCapture(event.pointerId))
            canvas.releasePointerCapture(event.pointerId);
          canvas.style.cursor = "";
          if (shouldFlip) {
            flipped = !flipped;
            body.angularVelocity.y += flipped ? 10.5 : -10.5;
          }
          start();
        };

        const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : undefined;
        resizeObserver?.observe(container);
        const onWindowResize = () => resize();
        window.addEventListener("resize", onWindowResize);
        const intersectionObserver =
          "IntersectionObserver" in window
            ? new IntersectionObserver(([entry]) => {
                visible = entry?.isIntersecting ?? false;
                if (visible) start();
              })
            : undefined;
        intersectionObserver?.observe(container);
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", release);
        canvas.addEventListener("pointercancel", release);
        canvas.addEventListener("lostpointercapture", release);
        resize();
        setCanvasActive(true);

        if (isLocalImage(sceneBadge.photoUrl)) {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => {
            if (!alive) return;
            paintBadgeFront(frontCanvas, sceneBadge, image);
            frontTexture.needsUpdate = true;
            render();
          };
          image.src = sceneBadge.photoUrl!;
        }

        teardown = () => {
          cancelAnimationFrame(raf);
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          window.removeEventListener("resize", onWindowResize);
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", release);
          canvas.removeEventListener("pointercancel", release);
          canvas.removeEventListener("lostpointercapture", release);
          [
            bodyGeometry,
            faceGeometry,
            cardBack.geometry,
            ring.geometry,
            clasp.geometry,
            ropeGeometry,
            anchorMarker.geometry,
          ].forEach((geometry) => geometry.dispose());
          [edgeMaterial, frontMaterial, backMaterial, metalMaterial, ropeMaterial].forEach(
            (material) => material.dispose(),
          );
          [frontTexture, backTexture, strapTexture].forEach((texture) => texture.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        };
      })
      .catch(() => undefined);

    return () => {
      alive = false;
      teardown();
    };
  }, [sceneBadge]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {!canvasActive && (
        <div className="absolute inset-0 grid place-items-center px-5" aria-hidden="true">
          <div className="w-[min(100%,19rem)] border border-border bg-card p-5 text-foreground shadow-[8px_8px_0_rgba(27,25,21,0.13)]">
            <p className="label-mono text-primary">{initialsFor(badge.name)}. / PROFILE BADGE</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-full bg-forest font-heading text-xl text-forest-foreground">
                {initialsFor(badge.name)}
              </div>
              <div>
                <p className="font-heading text-xl uppercase leading-none">{badge.name}</p>
                <p className="mt-1 text-sm text-forest">{badge.title}</p>
              </div>
            </div>
            <p className="mt-5 font-mono text-xs text-muted-foreground">{badge.location}</p>
            <p className="mt-3 font-mono text-xs text-foreground">
              {badge.technologies.join(" / ")}
            </p>
            {badge.availability && (
              <p className="label-mono mt-5 inline-flex bg-forest px-3 py-1.5 text-forest-foreground">
                {badge.availability}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
