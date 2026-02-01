import type { Plugin } from "vite";
import yaml from "yaml";
import * as fs from "fs";

export default function injectGamelists(): Plugin {
    return {
        name: "inject-gamelists",
        handleHotUpdate: {
            handler({ file, server }): void {
                if (file.endsWith("/gamelist.yaml")) server.ws.send({ type: "full-reload" });
            },
        },
        transformIndexHtml: {
            handler(html: string): string {
                interface GameEntry {
                    title: string;
                    playlist: string;
                    video: string;
                    system?: string;
                    year?: string;
                    extra?: string;
                }
                function createEntryBlock(entry: GameEntry): string {
                    return (
                        `<li>` +
                        `<a href="${entry.video ? `https://youtu.be/${entry.video}&list=${entry.playlist}` : `https://youtube.com/playlist?list=${entry.playlist}`}" target="_blank">` +
                        `<div class="game-entry">` +
                        `<div class="game-thumbnail-container">` +
                        `<img class="game-thumbnail" loading="lazy" src="https://i.ytimg.com/vi/${entry.video}/default.jpg" alt="">` +
                        `</div>` +
                        `<div class="game-info">` +
                        `<div class="game-title">${entry.title}</div>` +
                        (entry.system || entry.year
                            ? `<div class="game-meta">` +
                              (entry.system ? `<span class="game-meta-system">${entry.system}</span>` : "") +
                              (entry.year ? `<span class="game-meta-year">${entry.year}</span>` : "") +
                              `</div>`
                            : "") +
                        (entry.extra ? `<span class="game-extra">${entry.extra}</span>` : "") +
                        `</div>` +
                        `</div>` +
                        `</a>` +
                        `</li>`
                    );
                }
                function createList(entries: GameEntry[], reversed = false): string {
                    if (!entries) return "";
                    return (
                        `<ol${reversed ? ' reversed=""' : ""}>` +
                        (reversed ? entries.slice().reverse() : entries).map(createEntryBlock).join("") +
                        `</ol>`
                    );
                }
                const gamelist = yaml.parse(fs.readFileSync("./gamelist.yaml", "utf8"));
                for (const [id, content] of Object.entries(gamelist))
                    html = html.split(`<!-- ${id} -->`).join(createList(content as GameEntry[], id === "finished"));
                return html;
            },
        },
    };
}
