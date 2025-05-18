import { useState } from 'react';
import { Stage, Layer, Rect, Group, Arrow, Circle, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { CONNECTOR_OFFSET } from '../../lib/constants';
import type { DiagramBlock, Connection } from '../../lib/types';

interface DiagramCanvasProps {
  blocks: DiagramBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<DiagramBlock[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  width: number;
  height: number;
}

export default function DiagramCanvas({
  blocks,
  setBlocks,
  connections,
  setConnections,
  width,
  height,
}: DiagramCanvasProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<{
    id: string;
    dir: 'top' | 'bottom' | 'left' | 'right';
  } | null>(null);
  const [tempLineEnd, setTempLineEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const updateBlockPosition = (id: string, x: number, y: number) => {
    setBlocks((prev: DiagramBlock[]) =>
      prev.map((block) => (block.id === id ? { ...block, x, y } : block))
    );
  };

  const setHover = (id: string, hover: boolean) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, isHovered: hover } : block
      )
    );
  };

  const getConnectorPosition = (
    block: DiagramBlock,
    dir: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    switch (dir) {
      case 'top':
        return { x: block.x + block.width / 2, y: block.y - CONNECTOR_OFFSET };
      case 'bottom':
        return {
          x: block.x + block.width / 2,
          y: block.y + block.height + CONNECTOR_OFFSET,
        };
      case 'left':
        return { x: block.x - CONNECTOR_OFFSET, y: block.y + block.height / 2 };
      case 'right':
        return {
          x: block.x + block.width + CONNECTOR_OFFSET,
          y: block.y + block.height / 2,
        };
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isConnecting || !connectFrom) return;
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setTempLineEnd(pointerPos);

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === connectFrom.id)
          return { ...block, isTargetCandidate: false };

        const isOver =
          pointerPos.x >= block.x &&
          pointerPos.x <= block.x + block.width &&
          pointerPos.y >= block.y &&
          pointerPos.y <= block.y + block.height;

        return { ...block, isTargetCandidate: isOver };
      })
    );
  };

  const handleMouseUp = () => {
    if (!isConnecting || !connectFrom || !tempLineEnd) {
      resetConnectionState();
      return;
    }

    const target = blocks.find((b) => b.isTargetCandidate);

    if (target && target.id !== connectFrom.id) {
      const distances = {
        top: Math.abs(tempLineEnd.y - target.y),
        bottom: Math.abs(tempLineEnd.y - (target.y + target.height)),
        left: Math.abs(tempLineEnd.x - target.x),
        right: Math.abs(tempLineEnd.x - (target.x + target.width)),
      };

      const toDir = Object.entries(distances).sort(
        (a, b) => a[1] - b[1]
      )[0][0] as 'top' | 'bottom' | 'left' | 'right';

      setConnections((prev) => [
        ...prev,
        {
          from: connectFrom.id,
          to: target.id,
          fromDir: connectFrom.dir,
          toDir,
          color: '#d1d5db',
        },
      ]);
    }

    resetConnectionState();
  };

  const resetConnectionState = () => {
    setIsConnecting(false);
    setConnectFrom(null);
    setTempLineEnd(null);
    setBlocks((prev) => prev.map((b) => ({ ...b, isTargetCandidate: false })));
    setActiveBlockId(null);
  };

  const getArrowPoints = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    fromDir: string,
    toDir: string
  ): number[] => {
    const offset = 20;
    const points = [from.x, from.y];

    if (fromDir === 'right') points.push(from.x + offset, from.y);
    if (fromDir === 'left') points.push(from.x - offset, from.y);
    if (fromDir === 'top') points.push(from.x, from.y - offset);
    if (fromDir === 'bottom') points.push(from.x, from.y + offset);

    if (toDir === 'left') points.push(to.x - offset, to.y);
    if (toDir === 'right') points.push(to.x + offset, to.y);
    if (toDir === 'top') points.push(to.x, to.y - offset);
    if (toDir === 'bottom') points.push(to.x, to.y + offset);

    points.push(to.x, to.y);
    return points;
  };

  return (
    <div className="relative overflow-hidden">
      <Stage
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={() => {
          if (!isConnecting) setActiveBlockId(null);
        }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#f3f4f6"
            listening={false}
          />

          {connections.map((conn, index) => {
            const fromBlock = blocks.find((b) => b.id === conn.from)!;
            const toBlock = blocks.find((b) => b.id === conn.to)!;
            const from = getConnectorPosition(fromBlock, conn.fromDir);
            const to = getConnectorPosition(toBlock, conn.toDir);

            return (
              <Arrow
                key={index}
                points={getArrowPoints(from, to, conn.fromDir, conn.toDir)}
                stroke={conn.color}
                fill={conn.color}
                pointerLength={6}
                pointerWidth={6}
              />
            );
          })}

          {isConnecting && connectFrom && tempLineEnd && (
            <Arrow
              points={[
                getConnectorPosition(
                  blocks.find((b) => b.id === connectFrom.id)!,
                  connectFrom.dir
                ).x,
                getConnectorPosition(
                  blocks.find((b) => b.id === connectFrom.id)!,
                  connectFrom.dir
                ).y,
                tempLineEnd.x,
                tempLineEnd.y,
              ]}
              stroke="#3b82f6"
              fill="#3b82f6"
              pointerLength={6}
              pointerWidth={6}
            />
          )}

          {blocks.map((block) => {
            return (
              <Group
                key={block.id}
                x={block.x}
                y={block.y}
                draggable={!isConnecting}
                onDragEnd={(e: KonvaEventObject<DragEvent>) =>
                  updateBlockPosition(block.id, e.target.x(), e.target.y())
                }
                onMouseEnter={() => setHover(block.id, true)}
                onMouseLeave={() => setHover(block.id, false)}
                onMouseDown={(e) => {
                  const isConnectorClick =
                    e.target.getClassName?.() === 'Circle';
                  if (!isConnectorClick && !isConnecting) {
                    setActiveBlockId(block.id);
                  }
                }}
              >
                <Rect
                  x={-CONNECTOR_OFFSET}
                  y={-CONNECTOR_OFFSET}
                  width={block.width + CONNECTOR_OFFSET * 2}
                  height={block.height + CONNECTOR_OFFSET * 2}
                  fill="transparent"
                />
                <Rect
                  width={block.width}
                  height={block.height}
                  fill={block.fill}
                  stroke={
                    block.isTargetCandidate || block.id === activeBlockId
                      ? '#3b82f6'
                      : '#d1d5db'
                  }
                  strokeWidth={
                    block.isTargetCandidate || block.id === activeBlockId
                      ? 2
                      : 1
                  }
                  cornerRadius={8}
                />

                {(block.isHovered || block.isTargetCandidate) &&
                  (['top', 'bottom', 'left', 'right'] as const).map((dir) => {
                    const pos = getConnectorPosition(block, dir);
                    return (
                      <Circle
                        key={dir}
                        x={pos.x - block.x}
                        y={pos.y - block.y}
                        radius={6}
                        fill={block.isTargetCandidate ? '#3b82f6' : 'cyan'}
                        shadowBlur={block.isTargetCandidate ? 4 : 0}
                        onMouseDown={() => {
                          setConnectFrom({ id: block.id, dir });
                          setIsConnecting(true);
                        }}
                      />
                    );
                  })}

                <Text
                  text={
                    {
                      Box: '▣',
                      Database: '≡',
                      Code2: '</>',
                      Sparkles: '✦',
                      Briefcase: '⎈',
                      Panel: '▥',
                    }[block.icon] || '[?]'
                  }
                  x={block.width / 2 - 6}
                  y={block.height / 2 - 24}
                  fontSize={18}
                  fill="#5e636e"
                />
                <Text
                  text={block.name}
                  x={0}
                  y={block.height / 2 + 8}
                  width={block.width}
                  align="center"
                  fontSize={12}
                  fill="#4b5563"
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
