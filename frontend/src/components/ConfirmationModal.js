import React from 'react';

// Componente para confirmar el cierre de sesión
function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div id="confirmacion_cierre">
      <h2 className="red">Cierre de sesión</h2>
      <h3>¿Deseas cerrar la sesión?</h3>
      <section>
        {/* Botón para confirmar el cierre de sesión */}
        <div id="btn_cerrar_sesion" onClick={onConfirm}>
          <h3>Cerrar sesión</h3>
        </div>
        {/* Botón para cancelar la operación y volver atrás */}
        <div id="btn_volver" onClick={onCancel}>
          <h3>Volver</h3>
        </div>
      </section>
    </div>
  );
}

export default ConfirmationModal;