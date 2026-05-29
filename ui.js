/**
 * ui.js - Lógica de Interface Visual
 * Implementa Drag and Drop nativo HTML5 para ordenação visual das preferências
 */

class DragAndDropManager {
    constructor() {
        this.draggedElement = null;
        this.sortableList = document.getElementById('draggable-list');
        this.items = Array.from(this.sortableList.querySelectorAll('.draggable-item'));
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.items.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragover', this.handleDragOver.bind(this));
            item.addEventListener('drop', this.handleDrop.bind(this));
            item.addEventListener('dragend', this.handleDragEnd.bind(this));
            item.addEventListener('dragenter', this.handleDragEnter.bind(this));
            item.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    handleDragStart(event) {
        this.draggedElement = event.currentTarget;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.draggedElement.innerHTML);
        this.draggedElement.classList.add('dragging');
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(event) {
        const item = event.currentTarget;
        if (item !== this.draggedElement) {
            item.style.borderTop = '3px solid var(--primary-color)';
        }
    }

    handleDragLeave(event) {
        event.currentTarget.style.borderTop = '';
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        const targetItem = event.currentTarget;

        if (targetItem !== this.draggedElement) {
            const allItems = Array.from(this.sortableList.querySelectorAll('.draggable-item'));
            const draggedIndex = allItems.indexOf(this.draggedElement);
            const targetIndex = allItems.indexOf(targetItem);

            if (draggedIndex < targetIndex) {
                targetItem.parentNode.insertBefore(this.draggedElement, targetItem.nextSibling);
            } else {
                targetItem.parentNode.insertBefore(this.draggedElement, targetItem);
            }

            this.items = Array.from(this.sortableList.querySelectorAll('.draggable-item'));
        }

        targetItem.style.borderTop = '';
        return false;
    }

    handleDragEnd(event) {
        event.currentTarget.classList.remove('dragging');

        this.items.forEach(item => {
            item.style.borderTop = '';
        });
    }


    getCurrentRanking() {
        return Array.from(this.sortableList.querySelectorAll('.draggable-item')).map(
            item => parseInt(item.dataset.id)
        );
    }


    resetRanking() {
        const originalOrder = [1, 2, 3, 4, 5];
        const items = Array.from(this.sortableList.querySelectorAll('.draggable-item'));

        originalOrder.forEach(id => {
            const item = items.find(i => parseInt(i.dataset.id) === id);
            if (item) {
                this.sortableList.appendChild(item);
            }
        });

        this.items = Array.from(this.sortableList.querySelectorAll('.draggable-item'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dragDropManager = new DragAndDropManager();
});
