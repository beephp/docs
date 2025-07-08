document.addEventListener('DOMContentLoaded', function () {
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.sidebar nav a');


    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active');
        });
    }

    const activateLinkOnScroll = () => {

        const scrollPosition = window.scrollY + 150;
        let activeSectionId = null;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
                activeSectionId = section.getAttribute('id');
                break; 
            }
        }
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const isActive = (linkHref === '#' + activeSectionId);
            link.classList.toggle('active', isActive);
        });
    };

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', activateLinkOnScroll);
        activateLinkOnScroll();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar.classList.contains('is-open')) {
                sidebar.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
            }
        });
    });
});



function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeHighlights(container) {
    const highlights = container.querySelectorAll('.mark-highlight');
    highlights.forEach(span => {
        span.replaceWith(...span.childNodes);
    });
}

function highlightAllText(container, searchText) {
    if (!searchText.trim()) return;

    const regex = new RegExp(escapeRegExp(searchText), 'gi');

    const textNodes = [];

    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (
                    node.parentNode &&
                    node.parentNode.nodeName !== "SCRIPT" &&
                    regex.test(node.nodeValue)
                ) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        }
    );

    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
        const temp = document.createElement('div');
        temp.innerHTML = textNode.nodeValue.replace(regex, match => `<span class="mark-highlight">${match}</span>`);
        textNode.replaceWith(...temp.childNodes);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById('searchBox');
    const content = document.querySelector('main.content');

    searchBox.addEventListener('input', function () {
        removeHighlights(content);
        const value = this.value.trim();
        if (value.length > 1) {
            highlightAllText(content, value);
        }
    });
});