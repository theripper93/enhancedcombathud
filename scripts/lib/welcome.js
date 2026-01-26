import {MODULE_ID} from "../main.js";

const SHOWN_KEY = "chat-welcome-message-shown";

export function showWelcome() {
    if (!game.user.isGM) return;
    const module = game.modules.get(MODULE_ID);
    const VIDEO_ID = "2Iq_so_GsLA";
    const EMBEDDED_VIDEO = `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${VIDEO_ID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    const WIKI_URL = module.protected ? `https://wiki.theripper93.com/premium/${MODULE_ID}` : `https://wiki.theripper93.com/free/${MODULE_ID}`;
    const MESSAGE = `<h1>${module.title}</h1>
    <p>by <a href="https://theripper93.com">theripper93</a></p>
    <p><strong>New to ${module.title}? Visit the <a href="${WIKI_URL}">Wiki</a> for a quickstart guide and resources.</strong></p>
    ${VIDEO_ID ? EMBEDDED_VIDEO : ""}
    <p>Special thanks to all my <a href="https://www.patreon.com/theripper93">Patreons</a> for making ongoing updates and development possible. Supporting gives you access to <strong>30+ premium modules</strong> and <strong>priority support</strong>.</p>
    <p><strong>Explore all resources and modules:</strong></p> <ul>
    <li><a href="https://theripper93.com/">Check out all my free and premium modules</a></li>
    <li><a href="${WIKI_URL}">${module.title} Wiki</a></li>
    <li><a href="https://www.patreon.com/theripper93">Support on Patreon</a></li>
    <li><a href="https://discord.theripper93.com/">Discord Channel</a></li>
    </ul>`;


    game.settings.register(MODULE_ID, SHOWN_KEY, {
        default: false,
        type: Boolean,
        scope: "world",
        config: false,
    });

    if (!game.settings.get(MODULE_ID, SHOWN_KEY)) {

        ChatMessage.create({
            user: game.user.id,
            whisper: game.users.filter(u => u.isGM).map(u => u.id),
            blind: true,
            content: MESSAGE,
        });

        game.settings.set(MODULE_ID, SHOWN_KEY, true);
    }
}