const Modal = {

    open(id) {

        const modal =
            document.getElementById(id);

        if (!modal) return;

        modal.classList.remove(
            'hidden'
        );
    },

    close(id) {

        const modal =
            document.getElementById(id);

        if (!modal) return;

        modal.classList.add(
            'hidden'
        );
    }
};