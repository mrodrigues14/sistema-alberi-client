'use client';

import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FaCalendarAlt, FaNewspaper, FaImages, FaChartLine, FaUsers, FaFileAlt, FaCog, FaTasks, FaFileAlt as FaDocument, FaExclamationTriangle, FaCreditCard } from "react-icons/fa";
import Link from "next/link";
import styles from './page.module.css';

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const quickActions = [
    {
      title: "Tarefas",
      icon: FaTasks,
      href: "/kanban",
      description: "Organize suas tarefas e projetos",
      colorClass: styles.greenModule
    },
    {
      title: "Calendário",
      icon: FaCalendarAlt,
      href: "#",
      description: "Visualize e gerencie seus compromissos",
      colorClass: styles.blueModule
    },
    {
      title: "Extrato",
      icon: FaFileAlt,
      href: "/extrato",
      description: "Gerencie extratos e lançamentos",
      colorClass: styles.purpleModule
    },
    {
      title: "Documentos",
      icon: FaDocument,
      href: "#",
      description: "Acesse e gerencie documentos",
      colorClass: styles.blueModule
    },
    {
      title: "Configuração de Cliente",
      icon: FaCog,
      href: "/configuracaoCliente",
      description: "Configure clientes e suas informações",
      colorClass: styles.greenModule
    },
    {
      title: "Configuração de Usuário",
      icon: FaUsers,
      href: "/configuracaoUsuario",
      description: "Gerencie usuários e permissões",
      colorClass: styles.purpleModule
    },
    {
      title: "Gestão Asaas",
      icon: FaCreditCard,
      href: "/gestaoAssas",
      description: "Gerencie cobranças e clientes via Asaas",
      colorClass: styles.orangeModule
    },
    {
      title: "Reportar Falha",
      icon: FaExclamationTriangle,
      href: "/chamados",
      description: "Reporte problemas e solicite suporte",
      colorClass: styles.redModule
    }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div className={`${font.className} ${styles.container}`}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.logoContainer}>
                <Image
                  src="/icone_alberi.png"
                  alt="Alberi Consult Logo"
                  width={200}
                  height={200}
                  className={styles.logo}
                  priority
                />
              </div>
              <h1 className={styles.title}>
                Alberi Consult
              </h1>
              <p className={styles.subtitle}>
                Sistema de gestão financeira e administrativa para consultorias
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Ações Rápidas
            </h2>
            <div className={styles.grid}>
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={styles.moduleCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={`${styles.moduleIcon} ${action.colorClass}`}>
                      <action.icon className={styles.icon} />
                    </div>
                    <h3 className={styles.moduleTitle}>
                      {action.title}
                    </h3>
                  </div>
                  <p className={styles.moduleDescription}>
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Resumo do Sistema
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <div className={styles.statsContent}>
                  <div className={`${styles.statsIcon} ${styles.blueIcon}`}>
                    <FaUsers />
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Clientes Ativos</p>
                    <p className={styles.statsValue}>68</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.statsCard}>
                <div className={styles.statsContent}>
                  <div className={`${styles.statsIcon} ${styles.greenIcon}`}>
                    <FaFileAlt />
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Extratos Mapeados</p>
                    <p className={styles.statsValue}>1.2k</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.statsCard}>
                <div className={styles.statsContent}>
                  <div className={`${styles.statsIcon} ${styles.purpleIcon}`}>
                    <FaChartLine />
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Estudos Realizados</p>
                    <p className={styles.statsValue}>156</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Card */}
          <div className={styles.newsCard}>
            <div className={styles.newsContent}>
              <div className={styles.newsHeader}>
                <div className={styles.newsLogo}>
                  <Image
                    src="/logo.png"
                    alt="Notícias"
                    width={80}
                    height={80}
                  />
                </div>
                <h2 className={styles.newsTitle}>NOTÍCIAS</h2>
                <p className={styles.newsDescription}>
                  Fique por dentro das últimas atualizações e novidades do sistema Alberi Consult
                </p>
                <button className={styles.newsButton}>
                  Ver Notícias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
