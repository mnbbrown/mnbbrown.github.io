import React from 'react';
import styled from 'styled-components';
import Link from '../components/link';
import Layout from '../components/layout';
import SEO from '../components/seo';

const CompanyS = styled.div`
  margin-bottom: 2rem;
  page-break-inside: avoid;
`;

const CompanyLinkS = styled.a`
  color: inherit;
  text-decoration: underline;
  display: flex;
  align-items: center;

  svg {
    margin-left: 2px;
    height: 15px;
    color: #aaa;
  }
`;

const CompanyTitleS = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Company = ({ name, role, start, end, children, link }) => (
  <CompanyS>
    <CompanyTitleS>
      <h3>
        <CompanyLinkS href={link} target="_blank" rel="noreferrer">
          {name}
        </CompanyLinkS>
      </h3>
      {(role || start) && (
        <RoleNameS>
          {role}, {start} - {end || 'current'}
        </RoleNameS>
      )}
    </CompanyTitleS>
    {children}
  </CompanyS>
);

const RoleNameS = styled.div`
  font-family: Monaco, 'Courier New', monospace;
  font-size: 85%;
  color: #888;
`;

const RoleS = styled.div`
  margin-bottom: 2rem;

  @media print {
    margin-bottom: 0rem;
  }
`;

const RoleChildrenS = styled.div``;
const StackTagsS = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 1rem;
  gap: 0.2rem;
  font-size: 80%;
`;
const StackTagS = styled.li`
  padding: 0.2rem 0.4rem;
  margin: 0 0.4rem 0.4rem 0;
  background-color: #efefef;
  border-radius: 4px;
  display: inline-block;

  &:hover {
    background-color: #dedede;
  }
`;
const Role = ({ stack, children }) => {
  return (
    <RoleS>
      <RoleChildrenS>{children}</RoleChildrenS>
      {stack ? (
        <StackTagsS>
          {stack.sort().map((s) => (
            <StackTagS key={s}>{s}</StackTagS>
          ))}
        </StackTagsS>
      ) : (
        <></>
      )}
    </RoleS>
  );
};

const TitleS = styled.h1`
  font-size: 2rem;

  @media print {
    display: none;
  }
`;

const TitleNameS = styled.h1`
  display: none;
  opacity: 1;
  font-size: 2rem;

  @media print {
    display: block;
  }

  h1 {
    opacity: 0.2;
    display: inline;
  }
`;

const ResumeS = styled.div`
  line-height: 1.6;
`;

const ListS = styled.ul`
  & li {
    margin-bottom: 0;
  }
`;

const CompanyIndentS = styled.div`
  padding-left: 1rem;
  border-left: solid 1px #efefef;
`;

const SummaryS = styled.div`
  margin-bottom: 2rem;
`;

const Resume = ({ location }) => {
  return (
    <Layout>
      <SEO title="Resume" location={location} />
      <ResumeS>
        <TitleS>Resume</TitleS>
        <TitleNameS>
          Matthew Brown <h1>Resume</h1>
        </TitleNameS>
        <SummaryS>
          <p>I am currently a Principal Software Engineer at GoCardless.</p>
          <p>
            My passion is building complex technical systems and growing high performing engineering teams. I've spent
            most of my career at the pointy end of startups and new businesses - mostly in regulated environments such
            as healthcare and (more recently) fintech. I've led large engineering teams and shipped production code
            using a wide variety of languages, frameworks and cloud providers - across frontend, backend,
            infrastructure, data platforms and hardware.
          </p>
          <p>
            Outside of work I love travel, food (especially all things{' '}
            <a target="_blank" href="/2021/08/26/sandwich-loaf">
              bread
            </a>{' '}
            and{' '}
            <a href="https://www.instagram.com/p/BpZW1b4HE5m/" target="_blank" rel="noreferrer">
              pastry
            </a>
            ), and{' '}
            <a
              href="
    https://twitter.com/mnbbrown/status/1487054469770612737?s=20&t=BjnBvytvzqHdeyzNXJfBHA
    "
              target="_blank"
              rel="noreferrer"
            >
              aviation
            </a>{' '}
            - if all goes to plan I'll have my{' '}
            <a href="https://twitter.com/mnbbrown/status/1502738382782349316?s=20&t=BjnBvytvzqHdeyzNXJfBHA">PPL(A)</a>{' '}
            within the month. I plan to continue my training (IR, Night, Multi-Engine and Commercial) and have
            aspirations to fly from the{' '}
            <a href="https://en.wikipedia.org/wiki/Kangaroo_Route" target="_blank" rel="noreferrer">
              UK to Australia
            </a>{' '}
            in a zero-emission aircraft.
          </p>
          <p>
            I also have a bunch of side projects that I like to work on when time allows. These include an operations
            and scheduling app for flight schools, and a flight telemetry app for student pilots.
          </p>
        </SummaryS>
        <Company name="GoCardless" link="https://gocardless.com/" role="Principal Software Engineer" start="July 2021">
          <Role
            stack={[
              'Ruby on Rails',
              'Python',
              'GCP BigQuery',
              'PostgreSQL',
              'Apache Flink',
              'GCP Pub/Sub',
              'React',
              'Kubernetes',
            ]}
          >
            At GoCardless I work with the product teams responsible for managing our risk - across anti-fraud,
            anti-money laundering, compliance and credit risk. The role is a blend of hands-on development, architecture
            and system design, company wide technical leadership and mentorship.
          </Role>
        </Company>
        <Company name="BCG Digital Ventures" link="https://bcgdv.com/" start="Jan 2019" end="July 2021">
          <Role>
            At DV I was responsible for the technical architecture and delivery of complex venture builds with very
            compressed timeframes, coordinating with product, design and commercial leadership, and communicating with
            stakeholders including the board and venture partners.
          </Role>
        </Company>
        <CompanyIndentS>
          <Company name="Stealth IoT Venture" role="CTO" start="Jun 2020" end="July 2021">
            <Role
              stack={[
                'OEM hardware',
                'Zigbee',
                'Buildroot',
                'linux',
                'Python',
                'Go',
                'AWS IoT Core',
                'AWS DynamoDB',
                'AWS EKS',
                'Kinesis Analytics',
                'Apache Flink',
                'AWS Lambda',
                'Terraform',
                'AWS CDK',
                'React/React Native',
              ]}
            >
              Led a team of ~20 engineers building a product with a vision to transform the delivery of social care in
              the UK. This involved technical architecture and delivery of an ecosystem of hardware sensors, real time
              analytics and alerting platform, mobile app and web app. The product was rolled out to 150 homes during
              the COVID pandemic before being handed over to a full time team with a launch date later in 2022.
            </Role>
          </Company>
          <Company name="Epsy Health" link="https://epsyhealth.com/" role="CTO" start="Sep 2019" end="May 2020">
            <Role
              stack={['Python', 'Kubernetes', 'AWS Fargate', 'PostgreSQL', 'AWS RDS', 'Terraform', 'Swift', 'watchOS']}
            >
              Led a small team of 6 engineers to build Epsy. Epsy is a native iOS and Android mobile app, Apple Watch
              app and data platform that helps people living with epilepsy track and manage their seizures, triggers and
              medication, for more clarity in everyday life. We built and launched the core product before hiring a full
              time team who have grown it to the highest rating epilepsy app in the App Store and won several CES and
              Google Design awards..
            </Role>
          </Company>
          <Company name="HeyCar" link="https://heycar.co.uk/" role="Senior Engineer" start="March 2019" end="Aug 2019">
            <Role
              stack={[
                'Python',
                'Kubernetes',
                'AWS Lambda',
                'AWS RDS',
                'PostgreSQL',
                'Django',
                'React',
                'Typescript',
                'Terraform',
              ]}
            >
              heycar is a used car marketplace that features the quality used cars from selected dealers. Backed by
              Daimler and Volkswagen we launched the business in Aug 2019. I joined the team late in the venture and
              focused mainly on feature delivery and infrastructure to support spiky traffic patterns driven by our
              nationwide TV and out of home marketing campaign.
            </Role>
          </Company>
        </CompanyIndentS>
        <Company
          name="Labrys"
          link="https://labrys.io/"
          role="Lead Engineer (Contract)"
          start="Aug 2018"
          end="Jan 2019"
        >
          <Role stack={['React', 'Typescript', 'NodeJS', 'MySQL', 'Kuberentes', 'GCP']}>
            Led the turnaround and development of PrimaryLedger - an unlisted securities registry with over AUD$150
            million managed on the platform. Led design and delivery of a complex product in a tight timeframe, with a
            small team of engineers.
          </Role>
        </Company>
        <Company
          name="Maxwell Plus"
          link="https://www.maxwellplus.com/"
          role="Co-Founder, CEO and CPO"
          start="Jul 2016"
          end="Aug 2018"
        >
          <Role>
            Co-founded with Dr. Elliot Smith, Maxwell Plus is combining deep learning with modern medical imaging to
            develop cancer diagnostic tools that are faster, more accurate and more affordable – without the side
            effects of current methods. Originally called Maxwell MRI.
            <ListS>
              <li>Grew team from 2 founders to over 20 engineers and researchers</li>
              <li>Raised over $3.5mil AUD from venture funds, government grants, and high-net-worths</li>
              <li>
                Developed research and product relationships with world-leading cancer centers including UCL, the Garvan
                Institute and the US Dept of Veterans Affairs.
              </li>
              <li>
                Shareholder, stakeholder and customer engagement including pitching, investor updates and customer
                discovery workshops.
              </li>
              <li>
                Built v1 data management and machine learning platform and frontend doctor and patient experience.
              </li>
            </ListS>
          </Role>
        </Company>
        <h2>Education</h2>
        <p>Bachelor of Business, Queensland University of Technology </p>
        <h2>Other important bits</h2>
        <p>I have the right to work in both the United Kingdom and Australia without sponsorship.</p>
        <p>
          My email is <a href="mailto:me@matthewbrown.io">me@matthewbrown.io</a>, and phone is +44 7927 618 921.
        </p>
        <p>
          You can follow me on twitter via @mnnbrown and LinkedIn (
          <a href="https://www.linkedin.com/in/mnbbrown">https://www.linkedin.com/in/mnbbrown</a>)
        </p>
      </ResumeS>
    </Layout>
  );
};

export default Resume;
