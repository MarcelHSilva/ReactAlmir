import React, { useState, useEffect}  from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {

  const baseUrl="https://localhost:7197/api/Clientes";
  const [data, setData]=useState([]);

  const [modalEditar, setModalEditar]=useState(false);
  const [modalIncluir, setModalIncluir]=useState(false);
  const [modalExcluir, setModalExcluir]=useState(false);

  const [ClientesSelecionado, setClientesSelecionado]=useState({
    id: '',
    nome: '',
    idade: '',
    endereco: '',
    cpf: '',
    telefone: '',
    sexo: '',
    rg: '',
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setClientesSelecionado({
      ...ClientesSelecionado, 
      [name]: value
    });
    console.log(ClientesSelecionado);
  }

  //-----modal controle do estado 
  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirFecharModalExcluir=()=>{
    setModalExcluir(!modalExcluir);
  }

  const pedidoGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoPost=async()=>{
    delete ClientesSelecionado.id;
    ClientesSelecionado.idade=parseInt(ClientesSelecionado.idade);
      await axios.post(baseUrl, ClientesSelecionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  const ClientesPut=async()=>{
    ClientesSelecionado.idade=parseInt(ClientesSelecionado.idade);
    await axios.put(baseUrl+"/"+ClientesSelecionado.id, ClientesSelecionado)
    .then(response=>{
      var resposta=response.data;
      var dadosAuxiliar=data;
      //eslint-disable-next-line
      dadosAuxiliar.map(Clientes=>{
        if(Clientes.id===ClientesSelecionado.id){
          Clientes.nome=Clientes.nome;
          Clientes.idade=Clientes.idade;
          Clientes.endereco=Clientes.endereco;
          Clientes.cpf=Clientes.cpf;
          Clientes.telefone=Clientes.telefone;
          Clientes.sexo=Clientes.sexo;
          Clientes.rg=Clientes.rg;
        }
      });
      abrirFecharModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const ClientesDelete=async()=>{
    await axios.delete(baseUrl+"/"+ClientesSelecionado.id)
    .then(response=>{
      setData(data.filter(cliente => cliente.id !== ClientesSelecionado.id));
      abrirFecharModalExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  const selecionarClientes=(Clientes, caso)=>{
    setClientesSelecionado(Clientes);
      (caso==="Editar")?
        abrirFecharModalEditar(): abrirFecharModalExcluir();
  }

  useEffect(()=>{
    pedidoGet();
  }, []) 
  return (
    <div className="clientes-container">
       <br/>
       <h3>Cadastro de Clientes</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button onClick={()=>abrirFecharModalIncluir()} className="btn btn-success">Incluir Novo Cliente</button>
       </header>
       <table class="table table-sm table-dark">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Endereço</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Sexo</th>
            <th>RG</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(Clientes=>(
            <tr key={Clientes.id}>
              <td>{Clientes.id}</td>
              <td>{Clientes.nome}</td>
              <td>{Clientes.idade}</td>
              <td>{Clientes.endereco}</td>
              <td>{Clientes.cpf}</td>
              <td>{Clientes.telefone}</td>
              <td>{Clientes.sexo}</td>
              <td>{Clientes.rg}</td>
              <td>
              <button className="btn btn-primary" onClick={()=>selecionarClientes(Clientes, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>selecionarClientes(Clientes, "Excluir")}>Excluir</button>
              </td>
              </tr>
          ))}
        </tbody>
      </table>
      
      <Modal isOpen={modalIncluir}>
      <ModalHeader>Incluir Cliente</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nome: </label>
          <br />
          <input type="text" className="form-control" name="nome"  onChange={handleChange}/>
          <br />
          <label>Idade: </label>
          <br />
          <input type="text" className="form-control" name="idade" onChange={handleChange}/>
          <br />
          <label>Endereço: </label>
          <br />
          <input type="text" className="form-control" name="endereco" onChange={handleChange}/>
          <br />
          <label>CPF: </label>
          <br />
          <input type="text" className="form-control" name="cpf" onChange={handleChange}/>
          <br />
          <label>Telefone: </label>
          <input type="text" className="form-control" name="telefone" onChange={handleChange}/>
          <br />
          <label>Sexo: </label>
          <br />
          <input type="text" className="form-control" name="sexo" onChange={handleChange}/>
          <br />
          <label>RG: </label>
          <br />
          <input type="text" className="form-control" name="rg" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>pedidoPost()}>Incluir</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Cliente</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={ClientesSelecionado && ClientesSelecionado.id}/>
          <br />
          <label>Nome: </label>
          <br />
          <input type="text" className="form-control" name="nome" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.nome}/>
          <br />
          <label>Idade: </label>
          <br />
          <input type="text" className="form-control" name="idade" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.idade}/>
          <br />
          <label>Endereço: </label>
          <br />
          <input type="text" className="form-control" name="endereco" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.endereco}/>
          <br />
          <label>CPF: </label>
          <br />
          <input type="text" className="form-control" name="cpf" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.cpf}/>
          <br />
          <label>Telefone: </label>
          <br />
          <input type="text" className="form-control" name="telefone" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.telefone}/>
          <br />
          <label>Sexo: </label>
          <br />
          <input type="text" className="form-control" name="sexo" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.sexo}/>
          <br />
          <label>RG: </label>
          <br />
          <input type="text" className="form-control" name="rg" onChange={handleChange} value={ClientesSelecionado && ClientesSelecionado.rg}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>ClientesPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalExcluir}>
        <ModalBody>
        Confirma a exclusão deste(a) cliente(a) : {ClientesSelecionado && ClientesSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={()=>ClientesDelete()}>
            Sim
          </button>
          <button
            className="btn btn-danger" onClick={()=>abrirFecharModalExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
