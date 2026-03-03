  
        const API_URL =
            "http://192.168.1.15:1704/file/download-text?filepath=%2Fvar%2Flib%2FApiGateway%2Fdata%2Fconfigs%2Fagents.json";
        const EXEC_URL = "http://localhost:1704/linux/execute";

        function setError(text) {
            document.getElementById("error").textContent = text || "";
        }

        async function executeAgent(agentName) {
            const command = `python3 -m agents.${agentName}.functions.trigger`;

            const res = await fetch(EXEC_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command }),
            });

            const contentType = res.headers.get("content-type") || "";
            const payload = contentType.includes("application/json")
                ? await res.json()
                : await res.text();

            if (!res.ok) {
                const details =
                    typeof payload === "string" ? payload : JSON.stringify(payload);
                throw new Error(`HTTP ${res.status}: ${details}`);
            }

            return payload;
        }

        async function loadAgents() {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) {
                    throw new Error("HTTP " + res.status);
                }


                const raw = await res.json();
                if (!raw.ok) throw new Error("Load menu.json failed");
                const data = JSON.parse(raw.data);

                if (!Array.isArray(data)) {
                    throw new Error("agents.json không phải là array");
                }

                renderAgents(data);
            } catch (err) {
                document.getElementById("error").textContent =
                    "❌ Không load được agents: " + err.message;
            }
        }

        function renderAgents(agents) {
            const container = document.getElementById("agents");
            container.innerHTML = "";

            agents.forEach((agent) => {
                const card = document.createElement("div");
                card.className = "agent-card";

                const status = document.createElement("div");
                const isActive = agent.active ?? agent.enabled ?? true;
                status.className = "status " + (isActive ? "active" : "inactive");
                status.textContent = isActive ? "ACTIVE" : "INACTIVE";

                const name = document.createElement("div");
                name.className = "agent-name";
                name.textContent = agent.name || "Unnamed Agent";

                const desc = document.createElement("div");
                desc.className = "agent-desc";
                desc.textContent = agent.description || "No description provided.";

                const meta = document.createElement("div");
                meta.className = "agent-meta";

                Object.entries(agent).forEach(([key, value]) => {
                    if (
                        ["name", "description", "active", "enabled"].includes(key) ||
                        typeof value === "object"
                    )
                        return;

                    const tag = document.createElement("div");
                    tag.className = "tag";
                    tag.textContent = `${key}: ${value}`;
                    meta.appendChild(tag);
                });

                card.appendChild(status);
                card.appendChild(name);
                card.appendChild(desc);
                card.appendChild(meta);


                const actions = document.createElement("div");
                actions.className = "actions";

                const btnRun = document.createElement("button");
                btnRun.className = "action-btn";
                btnRun.textContent = "▶ RUN";
                btnRun.onclick = async () => {
                    const agentName = agent.name;
                    if (!agentName) return;

                    btnRun.disabled = true;
                    btnRun.textContent = "⏳ RUNNING...";
                    setError(`▶ Running: ${agentName}`);

                    try {
                        const result = await executeAgent(agentName);
                        setError(
                            `✅ Done: ${agentName}\n` +
                                (typeof result === "string"
                                    ? result
                                    : JSON.stringify(result, null, 2))
                        );
                    } catch (err) {
                        console.error("RUN error:", err);
                        setError(`❌ Run failed (${agentName}): ${err.message || err}`);
                    } finally {
                        btnRun.disabled = false;
                        btnRun.textContent = "▶ RUN";
                    }
                };

                const btnStop = document.createElement("button");
                btnStop.className = "action-btn danger";
                btnStop.textContent = "⏸ STOP";
                btnStop.onclick = () => {
                    console.log("STOP agent:", agent.name);
                };

                const btnConfig = document.createElement("button");
                btnConfig.className = "action-btn";
                btnConfig.textContent = "⚙ CONFIG";
                btnConfig.onclick = () => {
                    console.log("CONFIG agent:", agent);
                };

                const btnInfo = document.createElement("button");
                btnInfo.className = "action-btn";
                btnInfo.textContent = "📊 INFO";
                btnInfo.onclick = () => {
                    console.log("INFO agent:", agent);
                };

                actions.appendChild(btnRun);
                actions.appendChild(btnStop);
                actions.appendChild(btnConfig);
                actions.appendChild(btnInfo);

                card.appendChild(actions);

                container.appendChild(card);
            });
        }

        loadAgents();
