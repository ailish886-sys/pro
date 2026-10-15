/**
 * NovaAI — Interactive Frontend Controller
 * Handles Theme Switching, AI Playground Simulation, Tabs, Pricing, Accordions & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Theme Management (Dual-Mode: Dark & Light)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('nova_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        rootElement.setAttribute('data-theme', savedTheme);
    } else {
        rootElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            rootElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('nova_theme', nextTheme);
            showToast(nextTheme === 'dark' ? '🌙 Dark Aurora Theme Activated' : '☀️ Clean Minimalist Light Mode Activated');
        });
    }

    // ----------------------------------------------------
    // 2. Scroll Progress & Back-to-Top Floating Button
    // ----------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // 3. Mobile Navigation Menu Drawer
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close drawer when a link is tapped
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ----------------------------------------------------
    // 4. Interactive Live AI Code Playground Simulation
    // ----------------------------------------------------
    const presetChips = document.querySelectorAll('.preset-chip');
    const promptInput = document.getElementById('ai-prompt-input');
    const btnGenerate = document.getElementById('btn-generate-ai');
    const codeOutput = document.getElementById('code-output');
    const btnCopyCode = document.getElementById('btn-copy-code');
    const copyText = document.getElementById('copy-text');

    // Preset Code Templates
    const codeTemplates = {
        api: `// NovaAI Autonomous Agent Execution Engine
import { NovaAgent, Pipeline, PostgresPool, Authenticator } from "@nova/runtime";

export const workflow = new Pipeline({
  name: "Production Auth & Data Router",
  orchestrator: NovaAgent.model("nova-3.5-omni"),
  telemetry: true
});

workflow.step("authenticate", async (context) => {
  const session = await Authenticator.verifyJWT(context.request.headers.auth);
  return { userId: session.id, role: session.role };
});

workflow.step("query_database", async (context) => {
  return await PostgresPool.query("SELECT * FROM workflows WHERE owner_id = $1", [context.userId]);
});

// ✅ Synthesized in 38ms | Verified 0 Lint Errors | Ready to Deploy`,

        analytics: `// NovaAI Real-Time WebSocket Analytics Stream
import { TelemetryStream, EdgeBuffer, MetricAggregator } from "@nova/analytics";

const stream = new TelemetryStream({
  channel: "global-edge-events",
  batchWindowMs: 50
});

stream.onMessage(async (batch) => {
  const anomalies = await MetricAggregator.detectAnomalies(batch, {
    thresholdZScore: 3.2,
    algorithm: "isolation-forest"
  });
  
  if (anomalies.length > 0) {
    await EdgeBuffer.broadcastAlert({ level: "WARNING", count: anomalies.length });
  }
});

// ✅ Stream Active | Latency: 4.2ms | 100% Deterministic`,

        rag: `// NovaAI Multi-Agent Vector RAG Engine
import { VectorStore, HybridRetriever, CrossEncoderReranker } from "@nova/rag";

export async function answerQuery(userPrompt: string) {
  // Step 1: Semantic Dense + BM25 Sparse hybrid retrieval
  const candidateDocs = await HybridRetriever.search({
    query: userPrompt,
    vectorIndex: VectorStore.pinecone("enterprise-docs"),
    topK: 25
  });

  // Step 2: Cross-encoder semantic reranking
  const verifiedContext = await CrossEncoderReranker.rank(userPrompt, candidateDocs, { topN: 5 });

  return await NovaAgent.synthesize({
    prompt: userPrompt,
    context: verifiedContext,
    guardrails: ["prevent-pii-leakage", "cite-sources"]
  });
}

// ✅ RAG Mesh Initialized | Retrieval Accuracy: 99.4%`,

        deploy: `// NovaAI Serverless Edge Worker Definition
import { defineEdgeWorker, GeoRouting, CacheControl } from "@nova/edge";

export default defineEdgeWorker({
  name: "nova-edge-router",
  runtime: "edge-v8-isolated",
  routes: {
    "/v1/inference": async (req) => {
      const region = GeoRouting.nearestEdge(req.clientIp);
      const cached = await CacheControl.match(req);
      if (cached) return cached;

      return await NovaAgent.execute(req, { edgeRegion: region });
    }
  }
});

// 🚀 Deployed to 320 Edge PoPs | Anycast Route: ACTIVE`
    };

    const presetPrompts = {
        api: "Build an ultra-fast REST API router with JWT auth and Postgres pool",
        analytics: "Stream real-time telemetry metrics over WebSockets with anomaly detection",
        rag: "Multi-agent RAG pipeline with hybrid sparse/dense vector search and reranker",
        deploy: "Deploy sub-millisecond serverless worker to 320 global edge locations"
    };

    // Preset Chip Click
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const key = chip.getAttribute('data-preset');
            if (presetPrompts[key]) {
                promptInput.value = presetPrompts[key];
            }
            triggerSyntheticGeneration(key);
        });
    });

    // Run Pipeline Button
    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            const currentVal = promptInput.value.toLowerCase();
            let matchedKey = 'api';
            if (currentVal.includes('analytic') || currentVal.includes('stream') || currentVal.includes('metric')) {
                matchedKey = 'analytics';
            } else if (currentVal.includes('rag') || currentVal.includes('vector') || currentVal.includes('search')) {
                matchedKey = 'rag';
            } else if (currentVal.includes('deploy') || currentVal.includes('worker') || currentVal.includes('edge')) {
                matchedKey = 'deploy';
            }
            triggerSyntheticGeneration(matchedKey);
        });
    }

    if (promptInput) {
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                btnGenerate.click();
            }
        });
    }

    // Code Typing Effect Simulation
    function triggerSyntheticGeneration(key) {
        const fullCode = codeTemplates[key] || codeTemplates.api;
        codeOutput.textContent = '// Synthesizing AI pipeline with Nova 3.5 Omni...';
        
        let i = 0;
        const chunkSize = 8;
        const timer = setInterval(() => {
            i += chunkSize;
            codeOutput.textContent = fullCode.slice(0, i);
            if (i >= fullCode.length) {
                clearInterval(timer);
                codeOutput.textContent = fullCode;
                showToast('✨ Pipeline generated successfully!');
            }
        }, 12);
    }

    // Copy Code to Clipboard
    if (btnCopyCode) {
        btnCopyCode.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeOutput.textContent);
                copyText.textContent = 'Copied! ✨';
                showToast('📋 Code copied to clipboard');
                setTimeout(() => {
                    copyText.textContent = 'Copy Code';
                }, 2200);
            } catch (err) {
                showToast('📋 Code copied!');
            }
        });
    }

    // ----------------------------------------------------
    // 5. Animated Number Counters
    // ----------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedCounters = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedCounters) {
                hasAnimatedCounters = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    let current = 0;
                    const increment = target / 40;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = isDecimal ? target.toFixed(2) : target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
                        }
                    }, 35);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // ----------------------------------------------------
    // 6. Interactive Feature Tabs Switcher
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.feature-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = `panel-${btn.getAttribute('data-tab')}`;
            
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 7. Interactive Pricing Switcher (Monthly vs Yearly)
    // ----------------------------------------------------
    const billingToggle = document.getElementById('billing-toggle');
    const priceAmounts = document.querySelectorAll('.price-box .amount');

    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            const isYearly = billingToggle.getAttribute('aria-checked') === 'true';
            const nextState = !isYearly;
            billingToggle.setAttribute('aria-checked', nextState);

            priceAmounts.forEach(amountEl => {
                const monthlyPrice = amountEl.getAttribute('data-monthly');
                const yearlyPrice = amountEl.getAttribute('data-yearly');
                amountEl.textContent = nextState ? yearlyPrice : monthlyPrice;
            });

            showToast(nextState ? '🎉 20% Annual Discount Applied!' : 'Monthly Billing Selected');
        });
    }

    // ----------------------------------------------------
    // 8. FAQ Accordion
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close other items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ----------------------------------------------------
    // 9. Pricing Modal Checkout Simulation
    // ----------------------------------------------------
    const planButtons = document.querySelectorAll('[data-plan]');
    const planModal = document.getElementById('plan-modal');
    const modalClose = document.getElementById('modal-close');
    const modalPlanTitle = document.getElementById('modal-plan-title');
    const modalForm = document.getElementById('modal-form');

    planButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan') || 'Pro Studio';
            if (modalPlanTitle) {
                modalPlanTitle.textContent = `Activate ${planName} Plan`;
            }
            if (planModal) {
                planModal.classList.add('open');
                planModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (modalClose && planModal) {
        modalClose.addEventListener('click', () => {
            planModal.classList.remove('open');
            planModal.setAttribute('aria-hidden', 'true');
        });

        planModal.addEventListener('click', (e) => {
            if (e.target === planModal) {
                planModal.classList.remove('open');
                planModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (modalForm && planModal) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('modal-name');
            const name = nameInput ? nameInput.value : 'Developer';
            planModal.classList.remove('open');
            planModal.setAttribute('aria-hidden', 'true');
            showToast(`🚀 Workspace environment created for ${name}! Check your email.`);
            modalForm.reset();
        });
    }

    // ----------------------------------------------------
    // 10. Email Signup Form (CTA Section)
    // ----------------------------------------------------
    const ctaForm = document.getElementById('cta-form');
    const ctaEmail = document.getElementById('cta-email');

    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = ctaEmail ? ctaEmail.value.trim() : '';
            if (!email || !email.includes('@')) {
                showToast('⚠️ Please enter a valid email address');
                return;
            }
            showToast(`🎉 Access link dispatched to ${email}! Welcome aboard.`);
            ctaForm.reset();
        });
    }

    // Announcement pill click
    const announcementPill = document.getElementById('announcement-pill');
    if (announcementPill) {
        announcementPill.addEventListener('click', () => {
            showToast('🚀 Nova 3.5 Engine benchmark: 10x faster inference & 99.98% reliability!');
        });
    }

    // ----------------------------------------------------
    // 11. Global Toast Helper
    // ----------------------------------------------------
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message, duration = 3000) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // ----------------------------------------------------
    // 12. Dynamic Copyright Year
    // ----------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
