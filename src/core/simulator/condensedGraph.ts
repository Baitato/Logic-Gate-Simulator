import { SCC } from "../../types/ISCC";

function dfs(node: number, visited: Set<number>, adjacencyList: Map<number, Set<number>>, order: number[]): void {
    visited.add(node);

    for (const neighbor of adjacencyList.get(node) || []) {
        if (!visited.has(neighbor)) {
            dfs(neighbor, visited, adjacencyList, order);
        }
    }

    order.push(node);
}

export function getCondensedGraph(adjacencyList: Map<number, Set<number>>): SCC[] {
    // const condensedAdjacency: Map<SCC, SCC[]> = new Map();
    const visited = new Set<number>();
    const order: number[] = [];

    for (const [node] of adjacencyList) {
        if (!visited.has(node))
            dfs(node, visited, adjacencyList, order);
    }

    const reversedAdjacency: Map<number, Set<number>> = new Map();
    for (const [node, neighbors] of adjacencyList) {
        for (const neighbor of neighbors) {
            if (!reversedAdjacency.has(neighbor)) {
                reversedAdjacency.set(neighbor, new Set());
            }
            reversedAdjacency.get(neighbor)!.add(node);
        }
    }

    visited.clear();
    order.reverse();

    // const root: Map<number, number> = new Map();
    const scc: SCC[] = [];

    for (const node of order) {
        if (visited.has(node)) continue;

        const component: number[] = [];
        dfs(node, visited, reversedAdjacency, component);

        scc.push({ root: node, nodes: component });
    }

    return scc;
}