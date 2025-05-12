export default function initScrollFunctions(scrollData) {
    function initScroll() {
        const screenHeight = window.innerHeight;
        const scrollHeight = document.body.offsetHeight - screenHeight;
        const sectionOffsets = scrollData.map(({ sectionId: id, screenFr, anchor, transition }) => {
            const element = document.getElementById(id);
            if (!element) { return { id, transitionElement: false, offset: scrollHeight }; }
            const offset = getAndConfigureOffset(element, screenFr, anchor);
            return { id, transitionElement: transition ? element : false, offset };
        });
        sectionOffsets.sort((a, b) => { a.offset - b.offset });

        const scrollbarElement = document.getElementById("home-scrollbar");

        let prevScroll = scrollHeight;

        function getAndConfigureOffset(element, screenFr, anchor) {
            const viewportOffset = element.getBoundingClientRect();
            const scrollOffset = window.scrollY + viewportOffset.top;
            const anchorOffset = screenHeight * screenFr - viewportOffset.height * anchor;
            const offset = scrollOffset - anchorOffset;
            if (anchorOffset !== 0) {
                if (element.previousElementSibling) {
                    element.previousElementSibling.style.marginBottom = `-${anchorOffset}px`;
                }
                element.style.paddingTop = `${anchorOffset}px`;
            }
            return offset;
        }

        function initScrollAnchors() {
            sectionOffsets.forEach(({ id, offset }) => {
                const sectionScrollFr = offset / scrollHeight;
                const sectionAnchor = document.getElementById(`${id}-anchor`);
                sectionAnchor.style.setProperty("--fr", sectionScrollFr);
                sectionAnchor.classList.add("scroll-anchor-position");
            });
        }

        function updateScroll(prevScrollHeight) {
            return () => {
                const currScrollHeight = document.body.offsetHeight - window.innerHeight;
                if (currScrollHeight !== prevScrollHeight) {
                    initScroll();
                    return;
                }

                const currScroll = window.scrollY;
                const currScrollFr = currScroll / scrollHeight;
                const { currSection, isNew } = getCurrSection(currScroll);

                if (isNew) {
                    sectionOffsets.forEach(({ id, transitionElement }) => {
                        if (!transitionElement) { return; }
                        if (id === currSection) {
                            showSection(transitionElement);
                        } else {
                            hideSection(transitionElement);
                        }
                    });
                }

                scrollbarElement.style.width = currScrollFr * 100 + "%";

                prevScroll = currScroll;

                window.requestAnimationFrame(updateScroll(currScrollHeight));
            }
        }

        function getCurrSection(currScroll) {
            const { currSection, isNew } = sectionOffsets.reduce(
                (acc, section) => {
                    if (acc.isFound) { return acc; }
                    const isCurrSectionPassed = section.offset > currScroll;
                    const isPrevSectionPassed = section.offset > prevScroll;
                    
                    if (!isCurrSectionPassed && !isPrevSectionPassed) {
                        return {
                            prevSectionFound: false,
                            currSectionFound: false,
                            isFound: false,
                            currSection: section.id,
                            isNew: false
                        };
                    }
                    
                    if (!isCurrSectionPassed && isPrevSectionPassed) {
                        return {
                            prevSectionFound: true,
                            currSectionFound: false,
                            isFound: false,
                            currSection: section.id,
                            isNew: true
                        };
                    }
                    
                    if (isCurrSectionPassed && !isPrevSectionPassed) {
                        return {
                            prevSectionFound: false,
                            currSectionFound: true,
                            isFound: false,
                            currSection: acc.currSection,
                            isNew: true
                        };
                    }
                    
                    if (acc.prevSectionFound === acc.currSectionFound) {
                        return {
                            isFound: true,
                            currSection: acc.currSection,
                            isNew: false
                        };
                    }

                    return {
                        isFound: true,
                        currSection: acc.currSection,
                        isNew: true
                    };
                },
                {
                    prevSectionFound: false,
                    currSectionFound: false,
                    isFound: false,
                    currSection: null,
                    isNew: false
                }
            );
            return { currSection, isNew };
        }

        function showSection(element) {
            if (element.classList.contains("show")) { return; }

            element.classList.add("show");
            element.addEventListener("transitionend", removeShowOnEnd, { once: true });
            element.classList.remove("hide");
        }

        function hideSection(element) {
            if (element.classList.contains("hide")) { return; }

            element.classList.remove("show");
            element.removeEventListener("transitionend", removeShowOnEnd);
            element.classList.add("hide");
        }

        function removeShowOnEnd(event) {
            event.target.classList.remove("show");
        }

        initScrollAnchors();
        window.requestAnimationFrame(updateScroll(scrollHeight));
    }
    
    initScroll();
}