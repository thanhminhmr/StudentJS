CREATE DATABASE  IF NOT EXISTS `studentjs` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `studentjs`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: studentjs
-- ------------------------------------------------------
-- Server version	8.0.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'QH2015-I/CQ-C-CLC'),(2,'QH2015-I/CQ-C-A');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedbacks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sender` int(10) unsigned NOT NULL,
  `relater` int(10) unsigned NOT NULL,
  `message` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_idx` (`sender`),
  KEY `relater_idx` (`relater`),
  CONSTRAINT `relater` FOREIGN KEY (`relater`) REFERENCES `users` (`id`),
  CONSTRAINT `sender` FOREIGN KEY (`sender`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,7,1,'Test'),(2,7,3,'adsfydyjdyhsf'),(3,8,3,'waefrgthyjuki'),(4,1,1,'qwertyuiopdfghjkl;dfvghkl');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forms`
--

DROP TABLE IF EXISTS `forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `student` int(10) unsigned NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `studyingPoint` int(10) unsigned NOT NULL,
  `regulationsPoint` int(10) unsigned NOT NULL,
  `socialPoint` int(10) unsigned NOT NULL,
  `otherPoint` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_UNIQUE` (`student`),
  CONSTRAINT `student` FOREIGN KEY (`student`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forms`
--

LOCK TABLES `forms` WRITE;
/*!40000 ALTER TABLE `forms` DISABLE KEYS */;
INSERT INTO `forms` VALUES (1,1,0,17,9,25,10),(2,3,1,5,4,46,1),(3,5,2,5,14,30,6),(4,7,3,12,6,36,4),(5,9,0,8,2,24,6),(6,11,1,14,9,45,10),(7,13,2,18,2,38,8);
/*!40000 ALTER TABLE `forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL,
  `password` varchar(63) NOT NULL,
  `role` tinyint(3) unsigned NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `class` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `class_idx` (`class`),
  CONSTRAINT `class` FOREIGN KEY (`class`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nvan','123456',0,'Nguyễn Văn An',1),(2,'ttbinh','123456',0,'Trần Thanh Bình',1),(3,'lvcuong','123456',0,'Lê Văn Cường',1),(4,'btdung','123456',0,'Bùi Tiến Dũng',1),(5,'pvtem','123456',0,'Phan Văn Tài Em',1),(6,'ptgiang','123456',0,'Phạm Thu Giang',1),(7,'dvhung','123456',1,'Đoàn Văn Hùng',1),(8,'lqkhanh','123456',2,'Lô Quốc Khánh',1),(9,'hklinh','123456',0,'Hoàng Khánh Linh',2),(10,'ttmai','123456',0,'Trần Trúc Mai',2),(11,'nqnam','123456',0,'Nguyễn Quang Nam',2),(12,'ntphuong','123456',0,'Nguyễn Trí Phương',2),(13,'tdquang','123456',0,'Trần Đại Quang',2),(14,'bxson','123456',0,'Bùi Xuân Sơn',2),(15,'txthanh','123456',1,'Trịnh Xuân Thanh',2),(16,'lsvinh','123456',2,'Lê Sỹ Vinh',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-02  9:56:48
