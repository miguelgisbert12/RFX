import React from 'react';

function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div id="confirmacion_cierre">
      <h2 className="red">Cierre de sesión</h2>
      <h3>¿Deseas cerrar la sesión?</h3>
      <section>
        <div id="btn_cerrar_sesion" onClick={onConfirm}>
          <h3>Cerrar sesión</h3>
        </div>
        <div id="btn_volver" onClick={onCancel}>
          <h3>Volver</h3>
        </div>
      </section>
    </div>
  );
}

export default ConfirmationModal;