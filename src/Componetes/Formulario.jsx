import React, { useState, useEffect } from 'react';
import { firebase } from '../firebase';
import { nanoid } from 'nanoid';

const Formulario = () => {

    const objPersona = {
        cedula:'',
        nombre: '',
        apellido: '',
        estatura: '',
        sexo: '',
        telefono: '',
        fecha_nacimiento: " ",
        fecha_expedicion: " ",
    }

    const [persona, setpersona] = useState(objPersona);
    const [lista, setLista] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState('')
    const [error, setError] = useState(null);
    // const [fechaNacimiento, setFechaNacimiento] = React.useState("");


    useEffect(() => {
        const obtenerDatos = async () => {
            try {

                const db = firebase.firestore()
                const data = await db.collection('personas').get()
                const array = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))

                setLista(array)

            } catch (error) {
                console.log(error)
            }
        }

        obtenerDatos()
    })


    const guardarDatos = async (e) => {
        e.preventDefault()

        if (!persona.cedula) {
            setError('¡Vacio el campo cedula!');
            return
        }

        if (!persona.nombre) {
            setError('¡Vacio el campo nombre!');
            return
        }

        if (!persona.apellido) {
            setError('¡Vacio el campo apellido!');
            return
        }

        if (!persona.estatura) {
            setError('¡Vacio el campo estatura!');
            return
        }

        if (!persona.telefono) {
            setError('¡Vacio el campo telefono!');
            return
        }
        if(!persona.fecha_nacimiento){
            setError('Ingrese La Fecha')
            return
        }

        if(!persona.fecha_expedicion){
            setError('Ingrese La Fecha')
            return
        }

        try {

            const db = firebase.firestore();
            const personaNueva = {
                ...persona,
            }

            await db.collection('personas').add(personaNueva);

            setLista([...lista,
            { id: nanoid(), ...persona }
            ])

        } catch (error) {
            console.log(error)
        }

        setModoEdicion(false)
        setpersona(objPersona)
        setError(null)

    }

    const deleteConfirm = (id) => {
        let opcion = window.confirm('¿Está seguro que desea eliminar?')

        if (!opcion) {
        } else {

            eliminar(id);
        }

    }

    const eliminar = async (id) => {
        try {
            const db = firebase.firestore()
            await db.collection('personas').doc(id).delete()
            const aux = lista.filter(item => item.id !== id)
            setLista(aux)
        } catch (error) {
            console.log(error)
        }
    }

    const auxEditar = (item) => {

        const objPersona = {
            cedula: item.cedula,
            nombre: item.nombre,
            apellido: item.apellido,
            estatura: item.estatura,
            telefono: item.telefono,
            fecha_nacimiento: item.fecha_nacimiento,
            fecha_expedicion: item.fecha_expedicion,
        }

        setpersona(objPersona);
        setModoEdicion(true);
        setId(item.id);

    }

    const editar = async e => {
        e.preventDefault()

        if (!persona.cedula) {
            setError('Por favor digitar cedula');
            return
        }

        if (!persona.nombre) {
            setError('Por favor digitar nombre');
            return
        }

        if (!persona.apellido) {
            setError('Por favor digitar apellido');
            return
        }

        if (!persona.estatura) {
            setError('Por favor digitar estatura');
            return
        }

        if(!persona.sexo){
            setError('Por favor seleccionar sexo');
            return
        }
        if (!persona.telefono) {
            setError('Campo teléfono vacío');
            return
        }
        if(!persona.fecha_nacimiento){
            setError('Seleccione fecha');
            return
        }

        if(!persona.fecha_expedicion){
            setError('Seleccione fecha');
            return
        }

        try {

            const db = firebase.firestore()
            await db.collection('personas').doc(id).update({
                ...persona
            })

        } catch (error) {
            console.log(error)
        }

        setpersona(objPersona);
        setModoEdicion(false)
        setError(null)

    }

    const cancelar = () => {

        setpersona(objPersona)
        setModoEdicion(false)
        setError(null)
    }

    return (
        <div className='container-xxl mt-5'>
            <h1 className='text-center'>Directorio de Cedulas</h1>
            <hr />
            <div className='row'>
                <div className="col-8">
                    <h4 className="text-rigth"> Total de cedulas:  {lista.length}</h4>
                    {lista.length < 1 ?
                        <h2 className='mt-5 text-center'>No hay cedulas listados aún</h2>:
                        <table className="table table-white">
                            <thead>
                                <tr>
                                    <th scope="col">Cedula</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Estatura</th>
                                    <th scope="col">Sexo</th>
                                    <th scope="col">Teléfono</th>
                                    <th scope="col">Fecha Nacimiento</th>
                                    <th scope="col">Fecha expedicion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lista.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.cedula}</td>
                                            <td>{item.nombre}</td>
                                            <td>{item.apellido}</td>
                                            <td>{item.estatura}</td>
                                            <td>{item.sexo}</td>
                                            <td>{item.telefono}</td>
                                            <td>{item.fecha_nacimiento}</td>
                                            <td>{item.fecha_expedicion}</td>

                                            <td className='espacios'>
                                                <button className='btn btn-danger btn-sm float-end mx-2'
                                                    onClick={() => deleteConfirm(item.id)}>Eliminar
                                                </button>
                                                <button className='btn btn-warning btn-sm float-end'
                                                    onClick={() => auxEditar(item)}>Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div className="col-4">
                    <h4 className="text-center">
                        {
                            modoEdicion ? 'Editar persona' : 'Agregar persona'
                        }</h4>
                    <form onSubmit={modoEdicion ? editar : guardarDatos}>
                        {
                            error ? <span className='text-danger'>{error}</span> : null
                        }
                         <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese Cedula'
                            onChange={(e) => setpersona({ ...persona, cedula: e.target.value })}
                            value={persona.cedula}

                        />
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese Nombre'
                            onChange={(e) => setpersona({ ...persona, nombre: e.target.value })}
                            value={persona.nombre}

                        />
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese apellido'
                            onChange={(e) => setpersona({ ...persona, apellido: e.target.value })}
                            value={persona.apellido}
                        />
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese estatura'
                            onChange={(e) => setpersona({ ...persona, estatura: e.target.value })}
                            value={persona.estatura}
                        />
                        <a>Seleccione Sexo</a>
                        <select
                            className='form-select mb-2'
                            onChange={(e) => setpersona({ ...persona, sexo: e.target.value })}
                        >
                            <option value={persona.sexo}>{persona.sexo}</option>

                            {
                                !persona.sexo

                                    ?
                                    <>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </>
                                    :

                                    (persona.sexo === 'Masculino' ?

                                        <option value="Femenino">Femenino</option>

                                        :

                                        <option value="Masculino">Masculino</option>


                                    )
                            }
                        </select>
                        <input
                            className='form-control mb-2'
                            type="number"
                            min={0}
                            placeholder='Ingrese Teléfono'
                            onChange={(e) => setpersona({ ...persona, telefono: e.target.value })}
                            value={persona.telefono}
                        />
                        <a>Fecha Nacimiento</a>
                        <input
                            className='form-control mb-2'
                            type="date"
                            placeholder='Ingrese Fecha'
                            onChange={(e) => setpersona({ ...persona, fecha_nacimiento: e.target.value })}
                            value={persona.fecha_nacimiento}
                        />

                        <a>Fecha Nacimiento</a>
                        <input
                            className='form-control mb-2'
                            type="date"
                            placeholder='Ingrese Fecha'
                            onChange={(e) => setpersona({ ...persona, fecha_expedicion: e.target.value })}
                            value={persona.fecha_expedicion}
                        />
                        {
                            !modoEdicion ? (
                                <button className='btn btn-primary btn-block' type='submit'>Agregar</button>
                            )
                                :
                                (<>
                                    <button className='btn btn-warning btn-block' type='submit'>Editar</button>
                                    <button className='btn btn-dark btn-block mx-2' onClick={() => cancelar()}>Cancelar</button>
                                </>
                                )
                        }

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Formulario;